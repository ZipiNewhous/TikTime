export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { uploadImageFromUrl } from "@/lib/supabase/uploadImage";

export async function GET() {
  const testUrl =
    "https://cdn.beringtime.com/media/image/0f/d6/91/18132-004_600x600.jpg";
  const fileName = `test-bering-${Date.now()}.jpg`;

  console.log(`[test-upload] === Starting upload test ===`);

  const resultUrl = await uploadImageFromUrl(testUrl, fileName);

  const uploaded =
    resultUrl !== testUrl && resultUrl.includes("supabase.co/storage");

  console.log(`[test-upload] Result: ${uploaded ? "SUCCESS" : "FAILED"}`);
  console.log(`[test-upload] Result URL: ${resultUrl}`);

  return NextResponse.json({
    success: uploaded,
    testUrl,
    resultUrl,
    isStorageUrl: resultUrl.includes("supabase.co/storage"),
    supabaseUrlConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKeyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    message: uploaded
      ? "Image uploaded to Supabase Storage successfully"
      : "Upload failed — original URL returned as fallback",
  });
}
