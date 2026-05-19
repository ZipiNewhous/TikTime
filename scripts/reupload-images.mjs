/**
 * Bulk-uploads all product images from external URLs into Supabase Storage.
 * Uses Supabase REST API (PostgREST) — no direct DB connection needed.
 * Run: node scripts/reupload-images.mjs
 */
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
const BUCKET = "products";

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function uploadImageFromUrl(externalUrl, fileName) {
  try {
    const response = await fetch(externalUrl, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      return { ok: false, reason: `fetch ${response.status}` };
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType, upsert: true });

    if (error) return { ok: false, reason: error.message };

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${fileName}`;
    return { ok: true, publicUrl };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

async function main() {
  console.log("=== Bulk image re-upload to Supabase Storage ===\n");

  // Query all products with external image URLs via Supabase REST
  const restHeaders = {
    "apikey": serviceKey,
    "Authorization": `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  };

  // Fetch all products where image1 is not null and not already in Supabase storage
  // Use pagination to handle large datasets
  let products = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const url = `${supabaseUrl}/rest/v1/Product?select=id,sku,image1,brand_id&image1=not.is.null&image1=not.like.*supabase.co/storage*&order=id.asc&limit=${pageSize}&offset=${page * pageSize}`;
    const res = await fetch(url, { headers: restHeaders });

    if (!res.ok) {
      // Try lowercase table name
      const url2 = `${supabaseUrl}/rest/v1/products?select=id,sku,image1&image1=not.is.null&image1=not.like.*supabase.co/storage*&order=id.asc&limit=${pageSize}&offset=${page * pageSize}`;
      const res2 = await fetch(url2, { headers: restHeaders });
      if (!res2.ok) {
        const text = await res2.text();
        console.error("Failed to fetch products:", text);
        process.exit(1);
      }
      const batch = await res2.json();
      products = products.concat(batch);
      if (batch.length < pageSize) break;
    } else {
      const batch = await res.json();
      products = products.concat(batch);
      if (batch.length < pageSize) break;
    }
    page++;
  }

  console.log(`Found ${products.length} products with external image URLs to re-upload.\n`);

  if (products.length === 0) {
    console.log("✓ All product images are already in Supabase Storage or have no image.");
    return;
  }

  let uploaded = 0, failed = 0, skipped = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p.image1 || p.image1.includes("supabase.co/storage")) { skipped++; continue; }

    const safeName = `product-${p.id}-${p.sku}`
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 100) + ".jpg";

    process.stdout.write(`[${i + 1}/${products.length}] ${p.sku} → `);

    const result = await uploadImageFromUrl(p.image1, safeName);

    if (result.ok) {
      // Update product image1 via REST API
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/Product?id=eq.${p.id}`, {
        method: "PATCH",
        headers: restHeaders,
        body: JSON.stringify({ image1: result.publicUrl }),
      });

      if (!updateRes.ok) {
        // Try lowercase
        const updateRes2 = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${p.id}`, {
          method: "PATCH",
          headers: restHeaders,
          body: JSON.stringify({ image1: result.publicUrl }),
        });
        if (!updateRes2.ok) {
          console.log(`✓ uploaded but DB update failed`);
          failed++;
          continue;
        }
      }

      console.log(`✓ ${result.publicUrl}`);
      uploaded++;
    } else {
      console.log(`✗ ${result.reason}`);
      failed++;
    }

    // Small delay to avoid rate limiting
    if ((i + 1) % 10 === 0) await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== Summary ===`);
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Failed:   ${failed}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`\nDone.`);
}

main().catch(console.error);
