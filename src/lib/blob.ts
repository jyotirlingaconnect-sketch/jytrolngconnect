import { upload } from "@vercel/blob/client";
import { supabase } from "./supabase";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

export interface UploadProgressCallback {
  (progress: number): void;
}

/**
 * Validates the file format and size.
 */
export function validateImageFile(file: File): { valid: boolean; message?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: `Unsupported file format: ${file.type}. Allowed formats: JPG, JPEG, PNG, WEBP.`,
    };
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return {
      valid: false,
      message: `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB. Current size: ${fileSizeMB.toFixed(2)}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Sanitizes and generates a safe, clean, unique filename with prefix folder path.
 */
export function generateOptimizedFilename(file: File, folder: string): string {
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "webp";
  
  // Get base name without extension, replace special chars and spaces with dashes
  const baseName = file.name
    .substring(0, file.name.lastIndexOf("."))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const safeBaseName = baseName || "image";
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 6);

  // Example output: packages/mahakal-tour-1725487123-ab3c.webp
  return `${folder}/${safeBaseName}-${timestamp}-${randomStr}.${fileExt}`;
}

/**
 * Centered utility to upload a file to Vercel Blob Storage with secure client token authorization,
 * file validation, filename optimization, and real-time progress callbacks.
 */
export async function uploadImageToBlob(
  file: File,
  folder: "packages" | "gallery" | "settings" | "fleet",
  onProgress?: UploadProgressCallback
): Promise<string> {
  // 1. Validate file format and size
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  // 2. Fetch the current active Supabase session token to verify admin authorization
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) {
    throw new Error("Authentication session not found. Please log in again.");
  }

  // 3. Generate safe unique path/filename
  const optimizedPath = generateOptimizedFilename(file, folder);

  // 4. Perform upload via our own backend to avoid Vercel Blob client-side webhook hanging issues
  const formData = new FormData();
  formData.append("file", file);
  formData.append("pathname", optimizedPath);

  // We use XMLHttpRequest to keep the progress bar working
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentage = (event.loaded / event.total) * 100;
        onProgress(percentage);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } catch (err) {
          reject(new Error("Invalid response from server"));
        }
      } else {
        try {
          const errResponse = JSON.parse(xhr.responseText);
          reject(new Error(errResponse.error || "Upload failed"));
        } catch (err) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred during upload"));
    };

    xhr.open("POST", "/api/upload/server");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  });
}

/**
 * Centered utility to delete a file from Vercel Blob Storage.
 */
export async function deleteImageFromBlob(url: string): Promise<boolean> {
  // Only try to delete if it's a Vercel Blob URL to prevent errors on external/old urls
  if (!url.includes("public.blob.vercel-storage.com")) {
    return false;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) {
    throw new Error("Authentication session not found.");
  }

  const response = await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete file from Vercel Blob.");
  }

  return true;
}
