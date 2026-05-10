// scripts/setup-storage.mjs
// Run once to create the Supabase "products" public bucket.
// Usage: node scripts/setup-storage.mjs

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
const serviceKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function setup() {
  console.log("Creating 'products' storage bucket...");
  const { data, error } = await admin.storage.createBucket("products", {
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  if (error) {
    if (error.message.toLowerCase().includes("already exists")) {
      console.log("✓ Bucket 'products' already exists.");
    } else {
      console.error("✗ Failed to create bucket:", error.message);
      process.exit(1);
    }
  } else {
    console.log("✓ Bucket 'products' created successfully.");
  }
}

setup();
