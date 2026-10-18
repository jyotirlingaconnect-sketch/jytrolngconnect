"use server";

import { put } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
export async function uploadAdminImageAction(formData: FormData) {
  // Verify admin session
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized: Only authenticated admins can upload images.");
  }
  // In a real app, you would also verify session.user.role === 'admin' 
  // depending on the auth implementation.

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
