import { getSupabaseAdmin } from "./client";

const BUCKET = "products";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export async function uploadImageFromUrl(
  externalUrl: string,
  fileName: string
): Promise<string> {
  console.log(`[upload] START — file: ${fileName}`);
  console.log(`[upload] Source URL: ${externalUrl}`);

  try {
    // 1. Fetch the image
    console.log(`[upload] Fetching image...`);
    const response = await fetch(externalUrl, {
      signal: AbortSignal.timeout(15000),
    });

    console.log(`[upload] Fetch status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error(`[upload] Fetch failed: HTTP ${response.status}`);
      return externalUrl;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";

    console.log(`[upload] Image size: ${buffer.byteLength} bytes, type: ${contentType}`);

    // 2. Upload to Supabase Storage
    console.log(`[upload] Uploading to bucket "${BUCKET}" as "${fileName}"...`);

    const { data: uploadData, error } = await getSupabaseAdmin().storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType, upsert: true });

    if (error) {
      console.error(`[upload] Storage upload error:`, error.message, error);
      return externalUrl;
    }

    console.log(`[upload] Upload successful. Path:`, uploadData?.path);

    // 3. Build public URL explicitly
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
    console.log(`[upload] Public URL: ${publicUrl}`);

    return publicUrl;
  } catch (err) {
    console.error(`[upload] Unexpected error:`, err);
    return externalUrl;
  }
}
