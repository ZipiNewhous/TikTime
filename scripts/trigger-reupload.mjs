/**
 * Triggers the image re-upload via the live Vercel API.
 * Logs in as admin to get a JWT, then calls POST /api/admin/reupload-images in batches.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpass node scripts/trigger-reupload.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = "https://tiktime-store.vercel.app";
const BATCH_SIZE = 30;
const TOKEN_COOKIE = "tiktime-admin-token";

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => { rl.close(); resolve(answer); });
  });
}

async function login(email, password) {
  const res = await fetch(`${SITE_URL}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Login failed: ${res.status} — ${body.error ?? "unknown error"}`);
  }

  // Extract the JWT from the Set-Cookie header
  const setCookie = res.headers.get("set-cookie") ?? "";
  const match = setCookie.match(new RegExp(`${TOKEN_COOKIE}=([^;]+)`));
  if (!match) throw new Error("Login succeeded but could not extract JWT from cookie");

  return match[1];
}

async function getStats(token) {
  const res = await fetch(`${SITE_URL}/api/admin/reupload-images`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Stats request failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function runBatch(token, offset) {
  const res = await fetch(`${SITE_URL}/api/admin/reupload-images`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ limit: BATCH_SIZE, offset }),
  });
  if (!res.ok) throw new Error(`Batch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log(`=== Image re-upload via ${SITE_URL} ===\n`);

  const email    = process.env.ADMIN_EMAIL    || await prompt("Admin email: ");
  const password = process.env.ADMIN_PASSWORD || await prompt("Admin password: ");

  console.log("\nLogging in...");
  const token = await login(email, password);
  console.log("✓ Logged in.\n");

  // Stats
  const stats = await getStats(token);
  console.log(`Total products:    ${stats.total}`);
  console.log(`Supabase storage:  ${stats.supabaseStorage}`);
  console.log(`External URLs:     ${stats.externalUrl}  ← to be uploaded`);
  console.log(`No image:          ${stats.noImage}`);

  if (stats.externalUrl === 0) {
    console.log("\n✓ All images already in Supabase Storage.");
    return;
  }

  console.log(`\nProcessing in batches of ${BATCH_SIZE}...\n`);

  let offset = 0, totalUploaded = 0, totalFailed = 0, batchNum = 0;

  while (true) {
    batchNum++;
    process.stdout.write(`Batch ${batchNum} (offset=${offset})... `);
    const result = await runBatch(token, offset);
    console.log(`✓ uploaded=${result.uploaded}, failed=${result.failed}, remaining=${result.totalRemaining}`);

    totalUploaded += result.uploaded;
    totalFailed   += result.failed;

    if (result.processed === 0 || result.totalRemaining === 0) break;
    // Always offset=0: uploaded products are removed from the query so the list shifts
    offset = 0;
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n=== Done ===`);
  console.log(`Total uploaded: ${totalUploaded}`);
  console.log(`Total failed:   ${totalFailed}`);

  const finalStats = await getStats(token);
  console.log(`\nFinal: Supabase=${finalStats.supabaseStorage}, External=${finalStats.externalUrl}, No image=${finalStats.noImage}`);
}

main().catch(console.error);
