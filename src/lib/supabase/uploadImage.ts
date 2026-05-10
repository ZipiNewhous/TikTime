import { supabaseAdmin } from "./client";

const BUCKET = "products";

export async function uploadImageFromUrl(
  externalUrl: string,
  fileName: string
): Promise<string> {
  try {
    const response = await fetch(externalUrl, {
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return externalUrl;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType, upsert: true });

    if (error) {
      console.error(`Storage upload error for ${fileName}:`, error.message);
      return externalUrl;
    }

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    console.error(`uploadImageFromUrl failed for ${externalUrl}:`, err);
    return externalUrl;
  }
}
