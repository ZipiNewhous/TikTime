export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import * as xlsx from "xlsx";
import prisma from "@/lib/db/prisma";
import { uploadImageFromUrl } from "@/lib/supabase/uploadImage";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface ImportError {
  sheet: string;
  row: number;
  sku: string;
  error: string;
}

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  brands: number;
  brandSummary: Record<string, number>;
  errors: ImportError[];
}

/* ------------------------------------------------------------------ */
/* Column header → internal field name                                 */
/* ------------------------------------------------------------------ */
const HEADER_MAP: Record<string, string> = {
  "מותג":                  "brand",
  "דגם":                   "sku",
  "מין":                   "gender",
  "גוף השעון":             "case_material",
  "רצועה":                 "strap",
  "רצועת השעון":           "strap",
  "לוח":                   "dial",
  "לוח השעון":             "dial",
  "זכוכית":                "crystal",
  "קוטר":                  "diameter",
  "קוטר השעון":            "diameter",
  "עמיד במים":             "water_resistance",
  "מנגנון":                "movement",
  "אחריות":                "warranty",
  "ארץ היצור":             "country",
  "ארץ ייצור":             "country",
  "מחיר מחירון":           "price",
  "מחיר צרכן":             "price",
  "מחירון":                "price",
  "צרכן":                  "price",
  "מחיר קנייה":            "cost_price",
  "מחיר לכם":              "cost_price",
  "מחיר שלכם":             "cost_price",
  'עלות כולל מע"מ':        "cost_price",
  "ברקוד":                 "barcode",
  "קישור לתמונה":          "image_url",
  "תמונה":                 "image_url",
  "צבע השעון":             "color",
};

/* ------------------------------------------------------------------ */
/* Sheet name → canonical brand name                                   */
/* ------------------------------------------------------------------ */
const SHEET_BRAND_MAP: Record<string, string> = {
  "קלאוד ברנרד": "Claude Bernard",
  "ברינג":        "BERING",
  "טיסוט":        "TISSOT",
  "טומי":         "TOMMY HILFIGER",
  "מטיי טיסוט":  "MATHEY TISSOT",
  "סברובסקי":     "SWAROVSKI",
  "מישל":         "MICHELE",
  "סיטיזן":       "CITIZEN",
};

/* ------------------------------------------------------------------ */
/* Gender → category                                                   */
/* ------------------------------------------------------------------ */
const GENDER_CATEGORY: Record<string, { slug: string; name: string }> = {
  "לגבר":  { slug: "gevarim", name: "שעוני גברים" },
  "גבר":   { slug: "gevarim", name: "שעוני גברים" },
  "לאישה": { slug: "nashim",  name: "שעוני נשים"  },
  "אישה":  { slug: "nashim",  name: "שעוני נשים"  },
  "לחתן":  { slug: "chatan",  name: "שעון לחתן"   },
  "חתן":   { slug: "chatan",  name: "שעון לחתן"   },
  "לכלה":  { slug: "kala",    name: "שעוני כלות"  },
  "כלה":   { slug: "kala",    name: "שעוני כלות"  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function makeSlug(text: string, fallback: string): string {
  const latin = text.replace(/[^\x00-\x7F]/g, " ").trim();
  const base =
    latin.length >= 3
      ? latin.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)
      : fallback.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  return `${base || "product"}-${Math.random().toString(36).slice(2, 7)}`;
}

function cellStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/** Read a cell value: prefer computed numeric value; fall back to formula string. */
function readCell(sheet: xlsx.WorkSheet, r: number, c: number): unknown {
  const addr = xlsx.utils.encode_cell({ r, c });
  const cell = sheet[addr];
  if (!cell) return null;
  if (typeof cell.v === "number") return cell.v;
  // Formula with no cached numeric value → pass the formula string for manual resolution
  if (cell.f && (cell.v === undefined || cell.v === null)) return `=${cell.f}`;
  return cell.v ?? null;
}

/**
 * Resolve a cost_price value which may be a formula string like "=N2*0.68".
 * The formula always references the retail price column, so we apply the
 * multiplier/divisor directly to retailPrice.
 */
function resolvePrice(raw: unknown, retailPrice: number | null): number | null {
  if (raw === null || raw === undefined || raw === "") return null;
  const s = String(raw).trim();
  if (s === "") return null;

  // Already a plain number
  const direct = Number(s);
  if (!isNaN(direct) && !s.startsWith("=")) return direct > 0 ? direct : null;

  // Formula string — extract factor from the end: *0.68 or /1.2
  if (s.startsWith("=") && retailPrice !== null && retailPrice > 0) {
    const multMatch = s.match(/\*([\d.]+)\s*$/);
    if (multMatch) return Math.round(retailPrice * parseFloat(multMatch[1]));
    const divMatch = s.match(/\/([\d.]+)\s*$/);
    if (divMatch) return Math.round(retailPrice / parseFloat(divMatch[1]));
  }

  return null;
}

/**
 * Resolve the brand name for a product row.
 * Priority:
 *   1. מותג column cell value (stripped) — always use the actual row data first
 *   2. Sheet name map — only if the column is empty/missing
 *   3. Raw sheet name — last resort
 *
 * For bilingual values like " קלאוד ברנרד CLAUDE BERNARD " the Latin
 * portion is extracted and title-cased → "Claude Bernard".
 * Pure Hebrew values are returned as-is.
 */
function extractBrandName(sheetName: string, brandCell: string): string {
  // 1. Row's מותג column — highest priority, strip whitespace
  const cell = brandCell.trim();
  if (cell) {
    const latinMatch = cell.match(/[A-Z][A-Z\s\-]{2,}/);
    if (latinMatch) {
      return latinMatch[0]
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }
    return cell; // Hebrew-only or short value, use as-is
  }

  // 2. Sheet name map — fallback when מותג column is empty
  const mapped = SHEET_BRAND_MAP[sheetName.trim()];
  if (mapped) return mapped;

  // 3. Raw sheet name — last resort
  return sheetName.trim();
}

/* ------------------------------------------------------------------ */
/* DB helpers                                                          */
/* ------------------------------------------------------------------ */

async function resolveBrand(name: string, cache: Map<string, number>): Promise<number> {
  if (cache.has(name)) return cache.get(name)!;
  let brand = await prisma.brand.findFirst({ where: { name } });
  if (!brand) {
    brand = await prisma.brand.create({
      data: { name, slug: makeSlug(name, "brand"), active: true },
    });
  }
  cache.set(name, brand.id);
  return brand.id;
}

async function resolveCategory(
  slug: string,
  name: string,
  cache: Map<string, number>
): Promise<number> {
  if (cache.has(slug)) return cache.get(slug)!;
  let cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) {
    cat = await prisma.category.create({ data: { name, slug, active: true } });
  }
  cache.set(slug, cat.id);
  return cat.id;
}

/* ------------------------------------------------------------------ */
/* POST /api/admin/import-products                                      */
/* ------------------------------------------------------------------ */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "לא סופק קובץ" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = xlsx.read(buffer, {
      type: "buffer",
      codepage: 65001,
      cellFormula: true, // keep formula strings when no cached value
    });

    if (workbook.SheetNames.length === 0) {
      return NextResponse.json({ error: "הקובץ ריק" }, { status: 400 });
    }

    const result: ImportResult = {
      total: 0,
      imported: 0,
      skipped: 0,
      failed: 0,
      brands: 0,
      brandSummary: {},
      errors: [],
    };

    const brandCache = new Map<string, number>();
    const catCache   = new Map<string, number>();

    /* ── Process each sheet ─────────────────────────────────────── */
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const ref   = sheet["!ref"];
      if (!ref) continue;

      const range = xlsx.utils.decode_range(ref);

      /* ── Read headers from row 1, stop at first empty cell ──── */
      // colFieldMap: column index → internal field name
      // colRawMap:   column index → raw header string (for debug)
      const colFieldMap = new Map<number, string>();

      for (let c = range.s.c; c <= range.e.c; c++) {
        const headerVal = readCell(sheet, range.s.r, c); // row 0 = Excel row 1
        if (!headerVal) break; // stop at first empty header — avoids 16 382-column issue
        const field = HEADER_MAP[cellStr(headerVal).replace(/\s+/g, " ")];
        if (field && !colFieldMap.has(c)) {
          // Only store the first occurrence of each field name
          const alreadyMapped = [...colFieldMap.values()].includes(field);
          if (!alreadyMapped) colFieldMap.set(c, field);
        }
      }

      if (colFieldMap.size === 0) continue; // no recognisable headers — skip sheet

      /* ── Process data rows ──────────────────────────────────── */
      let sheetImported = 0;

      for (let r = range.s.r + 1; r <= range.e.r; r++) {
        result.total++;

        // Build { fieldName → cellValue } for this row
        const row: Record<string, unknown> = {};
        for (const [c, field] of colFieldMap) {
          row[field] = readCell(sheet, r, c);
        }

        /* ── Skip conditions ─────────────────────────────────── */
        const skuRaw = cellStr(row["sku"]);
        if (!skuRaw) { result.skipped++; continue; }

        // Duplicate header row guard
        if (cellStr(row["brand"]) === "מותג") { result.skipped++; continue; }

        // Row with no price data at all
        if (row["price"] === null && row["cost_price"] === null) {
          result.skipped++;
          continue;
        }

        try {
          /* ── Brand ─────────────────────────────────────────── */
          const brandName = extractBrandName(sheetName, cellStr(row["brand"]));

          /* ── Price ─────────────────────────────────────────── */
          const retailPrice = typeof row["price"] === "number"
            ? row["price"]
            : parseFloat(cellStr(row["price"]));

          if (isNaN(retailPrice) || retailPrice <= 0) {
            result.skipped++;
            continue;
          }

          const costPrice = resolvePrice(row["cost_price"], retailPrice);

          /* ── SKU uniqueness ─────────────────────────────────── */
          const existing = await prisma.product.findUnique({ where: { sku: skuRaw } });
          if (existing) { result.skipped++; continue; }

          /* ── Specs JSON ─────────────────────────────────────── */
          const SPEC_FIELDS: { label: string; field: string }[] = [
            { label: "מין",        field: "gender"           },
            { label: "גוף השעון",  field: "case_material"    },
            { label: "רצועה",      field: "strap"            },
            { label: "לוח",        field: "dial"             },
            { label: "זכוכית",     field: "crystal"          },
            { label: "קוטר",       field: "diameter"         },
            { label: "עמיד במים",  field: "water_resistance" },
            { label: "מנגנון",     field: "movement"         },
            { label: "אחריות",     field: "warranty"         },
            { label: "ארץ יצור",   field: "country"          },
            { label: "צבע",        field: "color"            },
          ];

          const specs = SPEC_FIELDS
            .map(({ label, field }) => {
              const v = cellStr(row[field]);
              return v ? { label, value: v } : null;
            })
            .filter(Boolean) as { label: string; value: string }[];

          if (costPrice !== null) {
            specs.push({ label: "מחיר קנייה", value: String(costPrice) });
          }

          /* ── Category from gender ───────────────────────────── */
          const gender   = cellStr(row["gender"]).split(/[,،]/)[0].trim(); // take first value if multiple
          const catEntry = GENDER_CATEGORY[gender] ?? null;

          /* ── Resolve DB records ─────────────────────────────── */
          const brandId = await resolveBrand(brandName, brandCache);

          let categoryId: number | null = null;
          if (catEntry) {
            categoryId = await resolveCategory(catEntry.slug, catEntry.name, catCache);
          }

          /* ── Image ──────────────────────────────────────────── */
          const rawImageUrl = cellStr(row["image_url"]) || null;
          let imageUrl: string | null = null;
          if (rawImageUrl) {
            const safeName = `${brandName}-${skuRaw}-${Date.now()}`
              .toLowerCase()
              .replace(/[^a-z0-9\-]/g, "-")
              .replace(/-+/g, "-")
              .slice(0, 100);
            imageUrl = await uploadImageFromUrl(rawImageUrl, `${safeName}.jpg`);
          }

          /* ── Create product ─────────────────────────────────── */
          const name = `${brandName} ${skuRaw}`;
          const slug = makeSlug(name, skuRaw);

          await prisma.product.create({
            data: {
              name,
              slug,
              sku:         skuRaw,
              brandId,
              price:       retailPrice,
              salePrice:   null,
              description: null,
              specs:       specs.length > 0 ? JSON.stringify(specs) : null,
              image1:      imageUrl,
              stockStatus: "in_stock",
              active:      true,
              featured:    false,
              productCategories: categoryId
                ? { create: { categoryId } }
                : undefined,
            },
          });

          result.imported++;
          sheetImported++;

        } catch (err) {
          result.failed++;
          result.errors.push({
            sheet: sheetName,
            row:   r + 1, // 1-based for display
            sku:   skuRaw || "?",
            error: err instanceof Error ? err.message : "שגיאה לא ידועה",
          });
        }
      }

      if (sheetImported > 0) {
        result.brands++;
        result.brandSummary[SHEET_BRAND_MAP[sheetName.trim()] ?? sheetName] = sheetImported;
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "שגיאה בעיבוד הקובץ" },
      { status: 500 }
    );
  }
}

