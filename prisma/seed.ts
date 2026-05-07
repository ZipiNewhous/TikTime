import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

// PrismaLibSql v7 takes config directly
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaLibSql({ url: "file:./dev.db" } as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Starting seed...");

  // ============================================================
  // BRANDS
  // ============================================================
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: "rolex" }, update: {}, create: { name: "Rolex", slug: "rolex" } }),
    prisma.brand.upsert({ where: { slug: "omega" }, update: {}, create: { name: "Omega", slug: "omega" } }),
    prisma.brand.upsert({ where: { slug: "tissot" }, update: {}, create: { name: "Tissot", slug: "tissot" } }),
    prisma.brand.upsert({ where: { slug: "longines" }, update: {}, create: { name: "Longines", slug: "longines" } }),
    prisma.brand.upsert({ where: { slug: "tag-heuer" }, update: {}, create: { name: "TAG Heuer", slug: "tag-heuer" } }),
    prisma.brand.upsert({ where: { slug: "seiko" }, update: {}, create: { name: "Seiko", slug: "seiko" } }),
    prisma.brand.upsert({ where: { slug: "citizen" }, update: {}, create: { name: "Citizen", slug: "citizen" } }),
    prisma.brand.upsert({ where: { slug: "casio" }, update: {}, create: { name: "Casio", slug: "casio" } }),
  ]);
  const [rolex, omega, tissot, longines, tagHeuer, seiko, citizen] = brands;
  console.log("✅ Brands created");

  // ============================================================
  // CATEGORIES
  // ============================================================
  const catGevarim = await prisma.category.upsert({
    where: { slug: "gevarim" },
    update: {},
    create: { name: "שעוני גברים", slug: "gevarim", order: 1 },
  });
  const catNashim = await prisma.category.upsert({
    where: { slug: "nashim" },
    update: {},
    create: { name: "שעוני נשים", slug: "nashim", order: 2 },
  });
  const catChatan = await prisma.category.upsert({
    where: { slug: "chatan" },
    update: {},
    create: { name: "שעוני חתן", slug: "chatan", order: 3 },
  });
  const catKala = await prisma.category.upsert({
    where: { slug: "kala" },
    update: {},
    create: { name: "שעוני כלה", slug: "kala", order: 4 },
  });
  console.log("✅ Categories created");

  // ============================================================
  // TAGS
  // ============================================================
  const tagSale = await prisma.tag.upsert({
    where: { slug: "mivtza" },
    update: {},
    create: { name: "מבצע", slug: "mivtza", color: "#e53e3e" },
  });
  const tagNew = await prisma.tag.upsert({
    where: { slug: "hadash" },
    update: {},
    create: { name: "חדש", slug: "hadash", color: "#38a169" },
  });
  const tagRecommended = await prisma.tag.upsert({
    where: { slug: "mumlatz" },
    update: {},
    create: { name: "מומלץ", slug: "mumlatz", color: "#c9a96e" },
  });
  console.log("✅ Tags created");

  // ============================================================
  // PRODUCTS
  // ============================================================
  const productsData = [
    // ROLEX MEN
    {
      name: "Rolex Submariner Date - שחור",
      slug: "rolex-submariner-date-black",
      brandId: rolex.id,
      price: 85000,
      salePrice: null,
      sku: "ROL-SUB-001",
      stockStatus: "in_stock",
      featured: true,
      description: "שעון הצלילה האיקוני של רולקס. עמיד למים עד 300 מטר, לוח שחור קלאסי עם תאריך.",
      specs: JSON.stringify([
        { label: "קוטר", value: "41 מ\"מ" },
        { label: "עמידות למים", value: "300 מטר" },
        { label: "חומר", value: "פלדת אוסטניט" },
        { label: "תנועה", value: "אוטומטית Cal. 3235" },
        { label: "מגן", value: "ספיר" },
      ]),
      categories: [catGevarim.id, catChatan.id],
      tags: [tagRecommended.id],
    },
    {
      name: "Rolex Datejust 41 - לבן",
      slug: "rolex-datejust-41-white",
      brandId: rolex.id,
      price: 72000,
      salePrice: 68000,
      sku: "ROL-DTJ-002",
      stockStatus: "in_stock",
      featured: true,
      description: "Datejust הקלאסי עם לוח לבן אלגנטי. סמל של יוקרה ויוקרה.",
      specs: JSON.stringify([
        { label: "קוטר", value: "41 מ\"מ" },
        { label: "עמידות למים", value: "100 מטר" },
        { label: "חומר", value: "אויסטרסטיל" },
        { label: "תנועה", value: "אוטומטית Cal. 3235" },
      ]),
      categories: [catGevarim.id, catChatan.id],
      tags: [tagSale.id, tagRecommended.id],
    },
    // OMEGA MEN
    {
      name: "Omega Seamaster 300M",
      slug: "omega-seamaster-300m",
      brandId: omega.id,
      price: 32000,
      salePrice: null,
      sku: "OMG-SEA-001",
      stockStatus: "in_stock",
      featured: true,
      description: "שעון הצלילה הפופולרי של אומגה. עיצוב ספורטיבי עם ביצועים יוצאי דופן.",
      specs: JSON.stringify([
        { label: "קוטר", value: "42 מ\"מ" },
        { label: "עמידות למים", value: "300 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית Co-Axial" },
      ]),
      categories: [catGevarim.id],
      tags: [tagNew.id],
    },
    {
      name: "Omega Speedmaster Moonwatch",
      slug: "omega-speedmaster-moonwatch",
      brandId: omega.id,
      price: 35000,
      salePrice: 31000,
      sku: "OMG-SPD-002",
      stockStatus: "in_stock",
      featured: false,
      description: "השעון הראשון על הירח. סמל של חלל ואומץ.",
      specs: JSON.stringify([
        { label: "קוטר", value: "42 מ\"מ" },
        { label: "עמידות למים", value: "50 מטר" },
        { label: "חומר", value: "פלדת אוסטניט" },
        { label: "תנועה", value: "ידנית Cal. 3861" },
      ]),
      categories: [catGevarim.id, catChatan.id],
      tags: [tagSale.id],
    },
    // TISSOT MEN
    {
      name: "Tissot PRX Powermatic 80",
      slug: "tissot-prx-powermatic-80",
      brandId: tissot.id,
      price: 4200,
      salePrice: null,
      sku: "TST-PRX-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון שוויצרי אלגנטי במחיר נגיש. עיצוב מודרני עם מחוגי 70 שעות כיוון.",
      specs: JSON.stringify([
        { label: "קוטר", value: "40 מ\"מ" },
        { label: "עמידות למים", value: "100 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catGevarim.id],
      tags: [tagNew.id],
    },
    {
      name: "Tissot T-Race",
      slug: "tissot-t-race",
      brandId: tissot.id,
      price: 3800,
      salePrice: 3400,
      sku: "TST-TRC-002",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון ספורט דינמי בהשראת מכוניות מרוץ.",
      specs: JSON.stringify([
        { label: "קוטר", value: "45 מ\"מ" },
        { label: "עמידות למים", value: "100 מטר" },
        { label: "חומר", value: "פלדה ופלסטיק" },
        { label: "תנועה", value: "קוורץ" },
      ]),
      categories: [catGevarim.id],
      tags: [tagSale.id],
    },
    // WOMEN
    {
      name: "Rolex Lady-Datejust - ורוד",
      slug: "rolex-lady-datejust-pink",
      brandId: rolex.id,
      price: 65000,
      salePrice: null,
      sku: "ROL-LDJ-001",
      stockStatus: "in_stock",
      featured: true,
      description: "השעון הנשי האיקוני של רולקס. עיצוב עדין ויוקרתי עם אבני ספיר.",
      specs: JSON.stringify([
        { label: "קוטר", value: "28 מ\"מ" },
        { label: "עמידות למים", value: "100 מטר" },
        { label: "חומר", value: "אויסטרסטיל" },
        { label: "תנועה", value: "אוטומטית Cal. 2236" },
      ]),
      categories: [catNashim.id, catKala.id],
      tags: [tagRecommended.id],
    },
    {
      name: "Omega Constellation Co-Axial",
      slug: "omega-constellation-co-axial",
      brandId: omega.id,
      price: 28000,
      salePrice: 25000,
      sku: "OMG-CON-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון נשי אלגנטי עם תנועת Co-Axial המובילה בשוק.",
      specs: JSON.stringify([
        { label: "קוטר", value: "29 מ\"מ" },
        { label: "עמידות למים", value: "50 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catNashim.id, catKala.id],
      tags: [tagSale.id],
    },
    {
      name: "Longines DolceVita",
      slug: "longines-dolcevita",
      brandId: longines.id,
      price: 8500,
      salePrice: null,
      sku: "LON-DOL-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון נשי אלגנטי בהשראת הנגה האיטלקית.",
      specs: JSON.stringify([
        { label: "קוטר", value: "29×21 מ\"מ" },
        { label: "עמידות למים", value: "30 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "קוורץ" },
      ]),
      categories: [catNashim.id, catKala.id],
      tags: [tagNew.id],
    },
    // LONGINES MEN
    {
      name: "Longines HydroConquest",
      slug: "longines-hydroconquest",
      brandId: longines.id,
      price: 7200,
      salePrice: 6500,
      sku: "LON-HYD-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון צלילה מקצועי של לונג'ין. עמיד, מדויק ויוקרתי.",
      specs: JSON.stringify([
        { label: "קוטר", value: "41 מ\"מ" },
        { label: "עמידות למים", value: "300 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catGevarim.id],
      tags: [tagSale.id],
    },
    // TAG HEUER
    {
      name: "TAG Heuer Carrera Chronograph",
      slug: "tag-heuer-carrera-chronograph",
      brandId: tagHeuer.id,
      price: 14500,
      salePrice: null,
      sku: "TAG-CAR-001",
      stockStatus: "in_stock",
      featured: true,
      description: "הכרונוגרף האיקוני של TAG Heuer. עיצוב ספורטיבי-אלגנטי.",
      specs: JSON.stringify([
        { label: "קוטר", value: "43 מ\"מ" },
        { label: "עמידות למים", value: "100 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catGevarim.id, catChatan.id],
      tags: [tagRecommended.id],
    },
    {
      name: "TAG Heuer Aquaracer",
      slug: "tag-heuer-aquaracer",
      brandId: tagHeuer.id,
      price: 9800,
      salePrice: 8900,
      sku: "TAG-AQU-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון ים ספורטיבי של TAG Heuer.",
      specs: JSON.stringify([
        { label: "קוטר", value: "43 מ\"מ" },
        { label: "עמידות למים", value: "300 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catGevarim.id],
      tags: [tagSale.id],
    },
    // SEIKO
    {
      name: "Seiko Prospex Diver",
      slug: "seiko-prospex-diver",
      brandId: seiko.id,
      price: 2800,
      salePrice: null,
      sku: "SEI-PRO-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון צלילה יפני בעל ביצועים מעולים.",
      specs: JSON.stringify([
        { label: "קוטר", value: "45 מ\"מ" },
        { label: "עמידות למים", value: "200 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catGevarim.id],
      tags: [tagNew.id],
    },
    {
      name: "Seiko 5 Sports",
      slug: "seiko-5-sports",
      brandId: seiko.id,
      price: 1200,
      salePrice: 990,
      sku: "SEI-5SP-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון ספורט מסדרת Seiko 5 הפופולרית.",
      specs: JSON.stringify([
        { label: "קוטר", value: "42.5 מ\"מ" },
        { label: "עמידות למים", value: "100 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catGevarim.id],
      tags: [tagSale.id],
    },
    // CITIZEN
    {
      name: "Citizen Eco-Drive Titanium",
      slug: "citizen-eco-drive-titanium",
      brandId: citizen.id,
      price: 2200,
      salePrice: null,
      sku: "CIT-ECO-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון Eco-Drive מטיטניום - קל, חזק ולעולם לא צריך סוללה.",
      specs: JSON.stringify([
        { label: "קוטר", value: "40 מ\"מ" },
        { label: "עמידות למים", value: "100 מטר" },
        { label: "חומר", value: "טיטניום" },
        { label: "תנועה", value: "סולארי" },
      ]),
      categories: [catGevarim.id],
      tags: [tagNew.id, tagRecommended.id],
    },
    // WEDDING (Chatan/Kala)
    {
      name: "Omega De Ville Prestige - חתן",
      slug: "omega-deville-prestige-chatan",
      brandId: omega.id,
      price: 22000,
      salePrice: null,
      sku: "OMG-DEV-001",
      stockStatus: "in_stock",
      featured: true,
      description: "שעון חתן אלגנטי ויוקרתי. השקעה לכל החיים.",
      specs: JSON.stringify([
        { label: "קוטר", value: "39.5 מ\"מ" },
        { label: "עמידות למים", value: "30 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catChatan.id, catGevarim.id],
      tags: [tagRecommended.id],
    },
    {
      name: "Longines Master Collection - כלה",
      slug: "longines-master-collection-kala",
      brandId: longines.id,
      price: 12000,
      salePrice: 10500,
      sku: "LON-MST-001",
      stockStatus: "in_stock",
      featured: true,
      description: "שעון כלה אלגנטי מסדרת Master Collection.",
      specs: JSON.stringify([
        { label: "קוטר", value: "34 מ\"מ" },
        { label: "עמידות למים", value: "30 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catKala.id, catNashim.id],
      tags: [tagSale.id, tagRecommended.id],
    },
    {
      name: "Tissot Everytime Swissmatic",
      slug: "tissot-everytime-swissmatic",
      brandId: tissot.id,
      price: 3200,
      salePrice: null,
      sku: "TST-EVR-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון יוניסקס אלגנטי ופשוט. מתאים לכל אירוע.",
      specs: JSON.stringify([
        { label: "קוטר", value: "38 מ\"מ" },
        { label: "עמידות למים", value: "30 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catGevarim.id, catNashim.id],
      tags: [],
    },
    {
      name: "Rolex Yacht-Master II",
      slug: "rolex-yacht-master-ii",
      brandId: rolex.id,
      price: 95000,
      salePrice: null,
      sku: "ROL-YM2-001",
      stockStatus: "out_of_stock",
      featured: false,
      description: "שעון השייט האולטימטיבי של רולקס. ביצועים, דיוק ויוקרה.",
      specs: JSON.stringify([
        { label: "קוטר", value: "44 מ\"מ" },
        { label: "עמידות למים", value: "100 מטר" },
        { label: "חומר", value: "אוראסטיל 904L" },
        { label: "תנועה", value: "אוטומטית Cal. 4161" },
      ]),
      categories: [catGevarim.id],
      tags: [],
    },
    {
      name: "Omega Aqua Terra 150M",
      slug: "omega-aqua-terra-150m",
      brandId: omega.id,
      price: 26000,
      salePrice: 23500,
      sku: "OMG-AQT-001",
      stockStatus: "in_stock",
      featured: false,
      description: "שעון ים ואקוורל. הרפתקה ואלגנטיות ב-DNA אחד.",
      specs: JSON.stringify([
        { label: "קוטר", value: "41 מ\"מ" },
        { label: "עמידות למים", value: "150 מטר" },
        { label: "חומר", value: "פלדה" },
        { label: "תנועה", value: "אוטומטית" },
      ]),
      categories: [catGevarim.id, catNashim.id],
      tags: [tagSale.id],
    },
  ];

  for (const data of productsData) {
    const { categories, tags, specs, ...productFields } = data;

    await prisma.product.upsert({
      where: { slug: productFields.slug },
      update: {},
      create: {
        ...productFields,
        specs: specs,
        productCategories: {
          create: categories.map((catId) => ({ categoryId: catId })),
        },
        productTags: {
          create: tags.map((tagId) => ({ tagId })),
        },
      },
    });
  }
  console.log("✅ Products created (20 products)");

  // ============================================================
  // ADMIN USER
  // ============================================================
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@tiktime.co.il" },
    update: {},
    create: {
      username: "admin",
      email: "admin@tiktime.co.il",
      passwordHash: hashedPassword,
      role: "admin",
    },
  });
  console.log("✅ Admin user created (email: admin@tiktime.co.il, password: admin123)");

  // ============================================================
  // SITE SETTINGS
  // ============================================================
  const defaultSettings = [
    { key: "site_name", value: "טיק טיים" },
    { key: "phone", value: "050-0000000" },
    { key: "email", value: "info@tiktime.co.il" },
    { key: "address", value: "ישראל" },
    { key: "shipping_cost", value: "0" },
    { key: "free_shipping_threshold", value: "0" },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("✅ Site settings created");

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
