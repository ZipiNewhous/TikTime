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

// Extract project ref from URL
const projectRef = supabaseUrl.replace("https://", "").split(".")[0];
console.log("Project ref:", projectRef);

// Check storage policies via Management API
const headers = {
  "Authorization": `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

// Test the public bucket URL with a signed URL to confirm access
const testUrl = `${supabaseUrl}/storage/v1/object/public/products/test-bering-1778622766141.jpg`;
console.log("\nTesting direct public URL...");
const res = await fetch(testUrl, { method: "HEAD" });
console.log(`Status: ${res.status} ${res.statusText}`);
console.log("Content-Type:", res.headers.get("content-type"));
console.log("Cache-Control:", res.headers.get("cache-control"));
console.log("Access-Control-Allow-Origin:", res.headers.get("access-control-allow-origin"));

// Check if CORS is set up for the bucket
console.log("\nChecking storage bucket CORS...");
const corsRes = await fetch(`${supabaseUrl}/storage/v1/bucket/products`, {
  headers,
});
const bucketInfo = await corsRes.json();
console.log("Bucket details:", JSON.stringify(bucketInfo, null, 2));
