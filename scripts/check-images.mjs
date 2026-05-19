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

const databaseUrl = readEnv("DATABASE_URL");

const { PrismaClient } = await import("@prisma/client");
const { PrismaPg } = await import("@prisma/adapter-pg");
const { Pool } = await import("pg");

const pool = new Pool({
  connectionString: databaseUrl.replace(/^﻿/, "").trim(),
  ssl: { rejectUnauthorized: false },
  max: 1,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const total = await prisma.product.count();
const noImage = await prisma.product.count({ where: { image1: null } });
const supabase = await prisma.product.count({ where: { image1: { contains: "supabase.co/storage" } } });
const external = total - noImage - supabase;

console.log("=== Product image status ===");
console.log(`Total products:          ${total}`);
console.log(`No image (null):         ${noImage}`);
console.log(`Supabase Storage URLs:   ${supabase}`);
console.log(`External/other URLs:     ${external}  ← still need re-upload`);

if (external > 0) {
  const samples = await prisma.product.findMany({
    where: {
      image1: { not: null },
      NOT: { image1: { contains: "supabase.co/storage" } },
    },
    select: { id: true, sku: true, image1: true },
    take: 3,
  });
  console.log("\nSample external URLs:");
  samples.forEach(p => console.log(`  [${p.id}] ${p.sku}: ${p.image1}`));
}

await prisma.$disconnect();
await pool.end();
