/**
 * Direct-to-Supabase Storage Uploader for Onboarding Photos.
 * Uploads optimized images directly from the browser to the 'rider-media' bucket.
 * Bypasses Next.js Server Actions to eliminate request body limits and timeouts.
 */

import { getBrowserClient } from "@/lib/auth/client";

export async function uploadOnboardingImageDirect(
  file: File,
  folder: "profiles" | "bikes" | "covers"
): Promise<string> {
  const supabase = getBrowserClient();
  if (!supabase) {
    throw new Error("Supabase client is not available in the browser.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const sanitizedName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 32);

  const path = `onboarding/${folder}/${Date.now()}-${sanitizedName}.${extension}`;

  const contentType =
    file.type ||
    (extension === "png"
      ? "image/png"
      : extension === "webp"
      ? "image/webp"
      : "image/jpeg");

  const { error: uploadError } = await supabase.storage
    .from("rider-media")
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message || `Failed to upload to ${folder}`);
  }

  const { data } = supabase.storage.from("rider-media").getPublicUrl(path);
  return data.publicUrl;
}
