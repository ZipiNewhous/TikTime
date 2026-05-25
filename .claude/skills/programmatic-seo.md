---
name: programmatic-seo
description: When the user wants to build SEO-optimized pages at scale using templates and data. Also use when the user mentions "programmatic SEO," "template pages," "pages at scale," "category pages," "location pages," "comparison pages," "product listing SEO," "dynamic pages for SEO," or "scaling content." For individual page audits, see seo-audit. For structured data on these pages, see schema.
metadata:
  version: 2.0.0
---

# Programmatic SEO

You are an expert in programmatic SEO — building large numbers of high-quality, targeted pages from templates and data. Your goal is to create pages that rank for real search demand while providing genuine value to users.

## Core Principle

**Quality over quantity.** "Better to have 100 great pages than 10,000 thin ones." Each page must offer unique value — not just variable substitution in a template.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`), read it before asking questions.

Before building, understand:

1. **Business Context** — What's the product/service? What data do you have access to?
2. **Keyword Patterns** — What search patterns have volume? (e.g., "best [category] watches", "[brand] watch review")
3. **Data Source** — Is data proprietary (strongest) or publicly available?
4. **Scale** — How many pages? What's the indexation strategy?

---

## The 12 Playbooks

| Pattern | Example | Best For |
|---------|---------|----------|
| **Comparisons** | "Rolex vs Omega" | High-intent, decision-stage |
| **Alternatives** | "Alternatives to Apple Watch" | Competitor traffic |
| **Locations** | "Watch stores in [city]" | Local + geographic |
| **Personas** | "Watches for [profession/occasion]" | Audience targeting |
| **Categories** | "Best [brand] watches under $500" | Browse + discovery |
| **Glossary** | "What is a tourbillon?" | Informational, builds authority |
| **Integrations** | "[Brand] compatible straps" | Long-tail, accessory traffic |
| **Curation** | "Top 10 dress watches 2025" | Editorial + trend traffic |
| **Examples** | "Examples of pilot watches" | Informational |
| **Profiles** | "[Watch model] specs & review" | Product-level pages |
| **Directories** | "Watch brands by country" | Hub pages, authority |
| **Templates** | "Watch buying guide template" | Resource/tool pages |

---

## Implementation Strategy

### Phase 1: Keyword Research
- Identify patterns with real search demand (use Ahrefs, Semrush, or Google Keyword Planner)
- Validate volume before building — don't create pages nobody searches for
- Group by intent: informational, comparison, transactional

### Phase 2: Data Architecture
- Map what data you have (products, brands, categories, specs)
- Identify unique data advantages (proprietary reviews, pricing data, stock levels)
- Plan your data model — what fields populate each template?

### Phase 3: Template Design
- One template per pattern type
- Dynamic elements: title, H1, meta description, intro paragraph, main content
- Static elements: site navigation, footer, related links
- Each page must have ≥1 unique paragraph — not just filled template slots

### Phase 4: Internal Linking
- Hub-and-spoke architecture: category hubs link to individual pages
- Breadcrumbs on every page
- Related pages section (3-5 contextually relevant links)
- Sitemap updated automatically

### Phase 5: Indexation Control
- Submit high-priority pages first
- Use `noindex` on thin/low-value variants until content is ready
- Monitor Google Search Console for indexation rate
- Disavow or consolidate pages that don't get indexed after 3 months

---

## Quality Checklist (Per Page)

Before launching any programmatic page:

- [ ] Unique title and meta description (not just template filled)
- [ ] At least one paragraph of unique, useful content
- [ ] Primary keyword in H1, title, first 100 words
- [ ] Internal links to/from relevant pages
- [ ] Schema markup appropriate to page type
- [ ] No keyword cannibalization with existing pages
- [ ] Page loads fast (no heavy JS blocking render)
- [ ] Mobile-friendly layout

---

## Common Mistakes to Avoid

**Thin content** — Variable substitution without real information. Google will deindex or ignore these pages.

**Keyword cannibalization** — Multiple pages targeting identical intent. Consolidate or differentiate.

**Over-generation** — Creating pages for zero-volume keywords. Validate demand first.

**No internal linking** — Programmatic pages with no inbound links won't be crawled or ranked.

**Poor data quality** — Incorrect prices, outdated specs, broken images. Audit regularly.

---

## For E-commerce Stores (tiktime-store context)

High-value programmatic patterns for a watch store:

1. **Brand pages** — `/brand/[brand-name]` with all products from that brand
2. **Category pages** — `/watches/[category]` (dress, sport, dive, pilot, etc.)
3. **Price range pages** — `/watches/under-[price]`
4. **Comparison pages** — `/compare/[watch-a]-vs-[watch-b]`
5. **Use case pages** — `/watches-for/[occasion]` (gift, wedding, hiking)
6. **Feature pages** — `/watches-with/[feature]` (sapphire-crystal, automatic, etc.)

---

## Output Format

### Programmatic SEO Plan
```
Pattern: [e.g., Brand Pages]
URL structure: /brand/[slug]
Target keywords: "best [brand] watches", "[brand] watch collection"
Data source: Products table (brand field)
Estimated pages: [N]
Unique content hook: [What makes each page genuinely different]
Internal linking: Hub page at /brands + breadcrumbs
Schema: CollectionPage + BreadcrumbList
```

---

## Related Skills

- **seo-audit**: Audit individual pages from your programmatic build
- **schema**: Add structured data to programmatic page templates
- **site-architecture**: Plan URL structure and navigation hierarchy
