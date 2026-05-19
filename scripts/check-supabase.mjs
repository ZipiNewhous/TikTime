import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");

function readEnv(key) {
  const content = fs.readFileSync(envPath, "utf-8");
  const line = content.split("\n").find((l) => l.startsWith(`${key}=`));
  return line?.replace(/^[^=]+=["']?/, "").replace(/["']?\s*$/, "").trim() ?? "";
}

const supabaseUrl = readEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey  = readEnv("SUPABASE_SERVICE_ROLE_KEY");

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("=== Supabase Storage bucket status ===\n");

  // 1. List all buckets
  const { data: buckets, error: bucketsErr } = await admin.storage.listBuckets();
  if (bucketsErr) { console.error("Failed to list buckets:", bucketsErr.message); process.exit(1); }

  console.log("Buckets:", buckets.map(b => `${b.name} (public=${b.public})`).join(", "));

  const productsBucket = buckets.find(b => b.name === "products");
  if (!productsBucket) {
    console.log("'products' bucket does NOT exist — creating it...");
    const { error: createErr } = await admin.storage.createBucket("products", {
      public: true,
      fileSizeLimit: 10485760,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
    if (createErr) { console.error("Failed to create bucket:", createErr.message); process.exit(1); }
    console.log("✓ Bucket 'products' created as public.");
  } else if (!productsBucket.public) {
    console.log("'products' bucket exists but is PRIVATE — updating to public...");
    const { error: updateErr } = await admin.storage.updateBucket("products", { public: true });
    if (updateErr) { console.error("Failed to update bucket:", updateErr.message); process.exit(1); }
    console.log("✓ Bucket 'products' is now public.");
  } else {
    console.log("✓ 'products' bucket exists and is public.");
  }

  // 2. Count files in bucket
  let allFiles = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data: files, error: listErr } = await admin.storage.from("products").list("", { limit: pageSize, offset: from });
    if (listErr) { console.error("Failed to list files:", listErr.message); break; }
    allFiles = allFiles.concat(files);
    if (files.length < pageSize) break;
    from += pageSize;
  }

  console.log(`\nFiles in 'products' bucket: ${allFiles.length}`);

  // 3. Test a public URL
  if (allFiles.length > 0) {
    const testFile = allFiles[0].name;
    const testUrl = `${supabaseUrl}/storage/v1/object/public/products/${testFile}`;
    console.log(`\nTesting public URL: ${testUrl}`);
    try {
      const res = await fetch(testUrl, { method: "HEAD" });
      console.log(`URL status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        console.log("✓ Images are publicly accessible.");
      } else {
        console.log("✗ Image URL returned non-OK status — bucket may not be truly public.");
      }
    } catch (e) {
      console.error("URL fetch failed:", e.message);
    }
  } else {
    console.log("\n⚠ No files in bucket yet.");
    console.log("  → To populate: go to your deployed site's admin panel,");
    console.log("    Products page, and click 'העלאת תמונות מחדש' (Re-upload images).");
    console.log("  → Or call POST /api/admin/reupload-images on the live server.");
  }

  console.log("\n=== Done ===");
}

main().catch(console.error);
