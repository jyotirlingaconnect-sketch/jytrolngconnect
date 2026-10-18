"use server";

import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/adminAuth";

/**
 * Upload an image (public access, e.g., for testimonials).
 * @param formData - Must contain a "file" field with the Blob/File to upload.
 */
export async function uploadPublicImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  // Restrict to images
  if (!file.type.startsWith("image/")) {
    throw new Error("Only images are allowed");
  }

  // Upload to Vercel Blob
  const blob = await put(file.name, file, {
    access: "public",
  });

  return blob.url;
}

/**
 * Upload an image (Admin only access, e.g., for fleet).
 * @param formData - Must contain a "file" field with the Blob/File to upload.
 */
export async function uploadAdminImageAction(accessToken: string | undefined, formData: FormData) {
  await requireAdmin(accessToken);

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  // Restrict to images
  if (!file.type.startsWith("image/")) {
    throw new Error("Only images are allowed");
  }

  // Upload to Vercel Blob
  const blob = await put(file.name, file, {
    access: "public",
  });

  return blob.url;
}
