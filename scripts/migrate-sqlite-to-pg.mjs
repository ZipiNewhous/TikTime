// migrate-sqlite-to-pg.mjs
// Reads all data from dev.db (SQLite) and inserts into Neon PostgreSQL
import { createClient } from "@libsql/client";
import pg from "pg";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../dev.db");

if (!fs.existsSync(dbPath)) {
  console.error("dev.db not found at", dbPath);
  process.exit(1);
}

// Load DATABASE_URL from .env
const envPath = path.resolve(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf-8");
const dbUrl = envContent
  .split("\n")
  .find((l) => l.startsWith("DATABASE_URL="))
  ?.replace(/^DATABASE_URL=["']?/, "")
  .replace(/["']?\s*$/, "")
  .replace(/^﻿/, "")
  .trim();

if (!dbUrl) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}

console.log("DATABASE_URL preview:", dbUrl.substring(0, 30) + "...");

const sqlite = createClient({ url: `file:${dbPath}` });
const pool = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

async function q(sql, params = []) {
  return (await sqlite.execute({ sql, args: params })).rows;
}

async function pg_run(client, sql, params = []) {
  return client.query(sql, params);
}

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // ── Categories ─────────────────────────────────────────────
    console.log("\n→ Categories");
    const categories = await q("SELECT * FROM Category ORDER BY id");
    // Insert parent categories first (parentId IS NULL), then children
    const roots = categories.filter((c) => c.parentId == null);
    const children = categories.filter((c) => c.parentId != null);
    for (const c of [...roots, ...children]) {
      await pg_run(client,
        `INSERT INTO "Category" (id, name, slug, description, "parentId", "order", active, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [c.id, c.name, c.slug, c.description, c.parentId, c.order ?? 0,
         c.active === 0 ? false : true,
         c.createdAt ? new Date(c.createdAt) : new Date(),
         c.updatedAt ? new Date(c.updatedAt) : new Date()]
      );
    }
    console.log(`   ${categories.length} rows`);

    // ── Brands ─────────────────────────────────────────────────
    console.log("→ Brands");
    const brands = await q("SELECT * FROM Brand ORDER BY id");
    for (const b of brands) {
      await pg_run(client,
        `INSERT INTO "Brand" (id, name, slug, description, logo, website, active, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [b.id, b.name, b.slug, b.description, b.logo, b.website,
         b.active === 0 ? false : true,
         b.createdAt ? new Date(b.createdAt) : new Date(),
         b.updatedAt ? new Date(b.updatedAt) : new Date()]
      );
    }
    console.log(`   ${brands.length} rows`);

    // ── Tags ───────────────────────────────────────────────────
    console.log("→ Tags");
    const tags = await q("SELECT * FROM Tag ORDER BY id");
    for (const t of tags) {
      await pg_run(client,
        `INSERT INTO "Tag" (id, name, slug, color, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO NOTHING`,
        [t.id, t.name, t.slug, t.color ?? "#c9a96e",
         t.createdAt ? new Date(t.createdAt) : new Date(),
         t.updatedAt ? new Date(t.updatedAt) : new Date()]
      );
    }
    console.log(`   ${tags.length} rows`);

    // ── Products ───────────────────────────────────────────────
    console.log("→ Products");
    const products = await q("SELECT * FROM Product ORDER BY id");
    for (const p of products) {
      await pg_run(client,
        `INSERT INTO "Product" (id, name, slug, "brandId", price, "salePrice", description, specs, sku,
           "stockStatus", image1, image2, image3, featured, active, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.name, p.slug, p.brandId, p.price, p.salePrice, p.description, p.specs,
         p.sku, p.stockStatus ?? "in_stock",
         p.image1, p.image2, p.image3,
         p.featured === 1 ? true : false,
         p.active === 0 ? false : true,
         p.createdAt ? new Date(p.createdAt) : new Date(),
         p.updatedAt ? new Date(p.updatedAt) : new Date()]
      );
    }
    console.log(`   ${products.length} rows`);

    // ── ProductCategory ────────────────────────────────────────
    console.log("→ ProductCategory");
    const pcs = await q("SELECT * FROM ProductCategory");
    for (const pc of pcs) {
      await pg_run(client,
        `INSERT INTO "ProductCategory" ("productId", "categoryId") VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [pc.productId, pc.categoryId]
      );
    }
    console.log(`   ${pcs.length} rows`);

    // ── ProductTag ─────────────────────────────────────────────
    console.log("→ ProductTag");
    const pts = await q("SELECT * FROM ProductTag");
    for (const pt of pts) {
      await pg_run(client,
        `INSERT INTO "ProductTag" ("productId", "tagId") VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [pt.productId, pt.tagId]
      );
    }
    console.log(`   ${pts.length} rows`);

    // ── AdminUser ──────────────────────────────────────────────
    console.log("→ AdminUser");
    const admins = await q("SELECT * FROM AdminUser ORDER BY id");
    for (const a of admins) {
      await pg_run(client,
        `INSERT INTO "AdminUser" (id, username, email, "passwordHash", role, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO NOTHING`,
        [a.id, a.username, a.email, a.passwordHash, a.role ?? "admin",
         a.createdAt ? new Date(a.createdAt) : new Date(),
         a.updatedAt ? new Date(a.updatedAt) : new Date()]
      );
    }
    console.log(`   ${admins.length} rows`);

    // ── SiteSetting ────────────────────────────────────────────
    console.log("→ SiteSetting");
    const settings = await q("SELECT * FROM SiteSetting ORDER BY id");
    for (const s of settings) {
      await pg_run(client,
        `INSERT INTO "SiteSetting" (id, key, value, "updatedAt")
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.key, s.value, s.updatedAt ? new Date(s.updatedAt) : new Date()]
      );
    }
    console.log(`   ${settings.length} rows`);

    // ── Reset sequences so new inserts get correct auto-IDs ────
    console.log("\n→ Resetting sequences");
    for (const [table, col] of [
      ["Category", "id"], ["Brand", "id"], ["Tag", "id"],
      ["Product", "id"], ["AdminUser", "id"], ["SiteSetting", "id"],
    ]) {
      await client.query(
        `SELECT setval(pg_get_serial_sequence('"${table}"', '${col}'), COALESCE((SELECT MAX(${col}) FROM "${table}"), 1))`
      );
    }

    await client.query("COMMIT");
    console.log("\n✓ Migration complete");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n✗ Migration failed:", err.message);
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    sqlite.close();
  }
}

migrate();
