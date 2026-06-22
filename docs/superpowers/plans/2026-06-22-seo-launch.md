# SEO & LLM Findability Launch — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add all crawlability, structured-data, and social-sharing fundamentals so cutpdf.fieber-it.com is correctly indexed by search engines and citable by LLMs.

**Architecture:** Pure static HTML site — no build system, no framework, no package manager. All changes are file creation (robots.txt, sitemap.xml, favicon.svg, og-image.svg) or direct edits to index.html. Commit each task independently.

**Tech Stack:** HTML, SVG, JSON-LD (inline `<script>` in HTML head)

**User decisions (already made):**
- "SVG favicon + programmatically generated SVG og:image (no external design tool)"
- "Serving from cutpdf.fieber-it.com until cutpdf.app domain acquired — canonical must match"
- "docs/ stays in .gitignore — specs/plans are local working artefacts, not committed"

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `robots.txt` | Create | Tell crawlers to index everything; point to sitemap |
| `sitemap.xml` | Create | Single-URL sitemap with lastmod |
| `favicon.svg` | Create | Browser tab icon — "c" black + "pdf" indigo |
| `og-image.svg` | Create | 1200×630 social-sharing image |
| `index.html` | Modify (head) | Fix canonical, add favicon link, complete OG tags, Twitter Card, JSON-LD |
| `index.html` | Modify (body) | Add "Wofür eignet sich cutpdf?" section to right card |

---

## Task 0: Create robots.txt and sitemap.xml

**Goal:** Create the two crawlability files so search engines can discover and index the site.

**Files:**
- Create: `robots.txt`
- Create: `sitemap.xml`

**Acceptance Criteria:**
- [ ] `robots.txt` exists at repo root, contains `Allow: /` and `Sitemap:` directive
- [ ] `sitemap.xml` exists at repo root, is valid XML, contains the canonical URL `https://cutpdf.fieber-it.com/`
- [ ] Both files committed

**Verify:** Open `robots.txt` and `sitemap.xml` in a text editor — confirm content matches spec below exactly.

**Steps:**

- [ ] **Step 1: Create robots.txt**

Create file `robots.txt` at repo root with this exact content:

```
User-agent: *
Allow: /

Sitemap: https://cutpdf.fieber-it.com/sitemap.xml
```

- [ ] **Step 2: Create sitemap.xml**

Create file `sitemap.xml` at repo root with this exact content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cutpdf.fieber-it.com/</loc>
    <lastmod>2026-06-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Commit**

```bash
git add robots.txt sitemap.xml
git commit -m "feat: add robots.txt and sitemap.xml for search engine crawlability"
```

---

## Task 1: Create favicon.svg

**Goal:** Create an SVG favicon that shows "c" in dark and "pdf" in indigo, matching the app's visual identity.

**Files:**
- Create: `favicon.svg`

**Acceptance Criteria:**
- [ ] `favicon.svg` exists at repo root
- [ ] Opening `index.html` in a browser shows the favicon in the browser tab
- [ ] File committed

**Verify:** Open `index.html` in a browser (e.g. `open index.html` on macOS) — favicon appears in the browser tab as "cpdf" with two colors. (Note: `index.html` head edit in Task 3 wires up the `<link rel="icon">` tag — verify visually after Task 3 is complete.)

**Steps:**

- [ ] **Step 1: Create favicon.svg**

Create file `favicon.svg` at repo root with this exact content:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#ffffff"/>
  <text x="3" y="23" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="#111827">c</text>
  <text x="11" y="23" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="#4f46e5">pdf</text>
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add favicon.svg
git commit -m "feat: add SVG favicon (c+pdf two-tone, matches app title)"
```

---

## Task 2: Create og-image.svg

**Goal:** Create a 1200×630 SVG social-sharing image with the app name and tagline for use as og:image and twitter:image.

**Files:**
- Create: `og-image.svg`

**Acceptance Criteria:**
- [ ] `og-image.svg` exists at repo root
- [ ] Opening the SVG in a browser shows: white card on light gray background, large "cutpdf.app" title with "pdf" in indigo, tagline in muted gray below
- [ ] File committed

**Verify:** `open og-image.svg` — confirm layout matches description above.

**Steps:**

- [ ] **Step 1: Create og-image.svg**

Create file `og-image.svg` at repo root with this exact content:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <!-- Background -->
  <rect width="1200" height="630" fill="#f1f5f9"/>
  <!-- White card -->
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="#ffffff"/>
  <!-- App title: "cut" black + "pdf" indigo + ".app" black -->
  <text
    x="600"
    y="320"
    text-anchor="middle"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    font-weight="800"
    font-size="112"
    fill="#111827"
  >cut<tspan fill="#4f46e5">pdf</tspan>.app</text>
  <!-- Tagline -->
  <text
    x="600"
    y="415"
    text-anchor="middle"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    font-size="34"
    fill="#6b7280"
  >PDF schneiden im Browser · kein Upload · kostenlos</text>
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add og-image.svg
git commit -m "feat: add og-image.svg for social sharing (1200x630)"
```

---

## Task 3: Update index.html head — canonical, meta tags, JSON-LD

**Goal:** Fix the canonical URL and add all missing head tags: favicon link, complete Open Graph, Twitter Card, and JSON-LD WebApplication schema.

**Files:**
- Modify: `index.html` (lines 3–13, the `<head>` block)

**Acceptance Criteria:**
- [ ] Canonical points to `https://cutpdf.fieber-it.com/` (not `cutpdf.app`)
- [ ] `<link rel="icon" type="image/svg+xml" href="favicon.svg">` present
- [ ] `og:url`, `og:locale`, `og:site_name`, `og:image` all present
- [ ] Twitter Card tags present (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [ ] JSON-LD `<script type="application/ld+json">` block present with `@type: WebApplication`
- [ ] JSON-LD validates without errors at https://search.google.com/test/rich-results (manual check)
- [ ] No browser console errors introduced
- [ ] Changes committed

**Verify:** Open `index.html` in browser, open DevTools → Elements, expand `<head>` — confirm all tags are present. Then validate JSON-LD at https://search.google.com/test/rich-results using the URL (after deploy) or paste the JSON manually.

**Steps:**

- [ ] **Step 1: Replace the entire `<head>` block in index.html**

Current head (lines 3–14):
```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PDF schneiden und teilen im Browser | cutpdf.app</title>
  <meta name="description" content="PDF schneiden und teilen: halbieren, vierteln oder als Raster kacheln. Ideal für Labels. Läuft lokal im Browser, ohne Upload." />
  <link rel="canonical" href="https://cutpdf.app/" />
  <meta name="robots" content="index,follow" />
  <meta property="og:title" content="PDF schneiden und teilen im Browser | cutpdf.app" />
  <meta property="og:description" content="PDF schneiden und teilen: halbieren, vierteln oder als Raster kacheln. Ideal für Labels. Läuft lokal im Browser, ohne Upload." />
  <meta property="og:type" content="website" />
  <link rel="stylesheet" href="style.css" />
</head>
```

Replace with:
```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PDF schneiden und teilen im Browser | cutpdf.app</title>
  <meta name="description" content="PDF schneiden und teilen: halbieren, vierteln oder als Raster kacheln. Ideal für Labels. Läuft lokal im Browser, ohne Upload." />
  <link rel="canonical" href="https://cutpdf.fieber-it.com/" />
  <meta name="robots" content="index,follow" />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  <meta property="og:title" content="PDF schneiden und teilen im Browser | cutpdf.app" />
  <meta property="og:description" content="PDF schneiden und teilen: halbieren, vierteln oder als Raster kacheln. Ideal für Labels. Läuft lokal im Browser, ohne Upload." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://cutpdf.fieber-it.com/" />
  <meta property="og:locale" content="de_DE" />
  <meta property="og:site_name" content="cutpdf.app" />
  <meta property="og:image" content="https://cutpdf.fieber-it.com/og-image.svg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="PDF schneiden im Browser | cutpdf.app" />
  <meta name="twitter:description" content="Halbieren, vierteln, kacheln — lokal, kein Upload." />
  <meta name="twitter:image" content="https://cutpdf.fieber-it.com/og-image.svg" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "cutpdf.app",
    "description": "PDF schneiden und teilen im Browser — halbieren, vierteln oder als Raster kacheln. Läuft lokal, ohne Upload.",
    "url": "https://cutpdf.fieber-it.com/",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "inLanguage": "de",
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "featureList": [
      "PDF halbieren (horizontal oder vertikal)",
      "PDF vierteln (2×2 Raster)",
      "PDF als beliebiges Raster kacheln",
      "Ausgabeformat A4 hoch, A4 quer oder eigenes Format in mm",
      "Kein Upload — läuft vollständig lokal im Browser",
      "Ideal für Etiketten (z. B. 100×150 mm für DPD/DHL)",
      "Open Source"
    ],
    "author": {
      "@type": "Person",
      "name": "Simon Fieber",
      "url": "https://fieber-it.com"
    }
  }
  </script>
  <link rel="stylesheet" href="style.css" />
</head>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: fix canonical URL, add favicon link, complete OG/Twitter tags, add JSON-LD WebApplication schema"
```

---

## Task 4: Update index.html body — add use-case section

**Goal:** Add a "Wofür eignet sich cutpdf?" section to the right info card, giving search engines and LLMs richer semantic content about use cases.

**Files:**
- Modify: `index.html` (right card section, after the existing `<p class="note">Open Source...` paragraph, before the "cutpdf.app unterstützen" block)

**Acceptance Criteria:**
- [ ] New `<h2>Wofür eignet sich cutpdf?</h2>` heading visible on the page
- [ ] 4 use-case list items visible: Versandetiketten, Poster, Präsentationsfolien, Splitten
- [ ] Section appears between the "Open Source" paragraph and the "cutpdf.app unterstützen" heading
- [ ] No visual regressions in the right card
- [ ] Changes committed

**Verify:** Open `index.html` in browser — scroll right card to confirm new section visible between the existing "Open Source" note and the Ko-Fi support section.

**Steps:**

- [ ] **Step 1: Locate insertion point in index.html**

Find this block in index.html (around line 171):
```html
        <p class="note" style="margin:0;">Open Source. Läuft lokal im Browser. Ideal für Labels und Druckvorlagen.</p>

        <div class="divider"></div>

        <div class="card-header">
          <h2 class="card-title">cutpdf.app unterstützen</h2>
        </div>
```

- [ ] **Step 2: Insert the new section between them**

Replace the block above with:
```html
        <p class="note" style="margin:0;">Open Source. Läuft lokal im Browser. Ideal für Labels und Druckvorlagen.</p>

        <div class="divider"></div>

        <div class="card-header">
          <h2 class="card-title">Wofür eignet sich cutpdf?</h2>
        </div>

        <ul class="note" style="margin:0; padding-left:18px;">
          <li>Versandetiketten im Format 100 × 150 mm (DHL, DPD, Hermes) aus A4-PDFs freistellen</li>
          <li>Großformatige Designs auf mehrere A4-Seiten aufteilen und als Poster drucken</li>
          <li>Präsentationsfolien oder Plakate in Kacheln zerschneiden</li>
          <li>Mehrseitige PDFs seitenweise splitten</li>
        </ul>

        <div class="divider"></div>

        <div class="card-header">
          <h2 class="card-title">cutpdf.app unterstützen</h2>
        </div>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add use-case section to info card for SEO/LLM content depth"
```

---

## Self-Review

**Spec coverage:**
- ✓ robots.txt → Task 0
- ✓ sitemap.xml → Task 0
- ✓ favicon.svg → Tasks 1 + 3 (file + link tag)
- ✓ og-image.svg → Tasks 2 + 3 (file + og:image tag)
- ✓ Canonical fix → Task 3
- ✓ OG tags complete → Task 3
- ✓ Twitter Card → Task 3
- ✓ JSON-LD WebApplication → Task 3
- ✓ Use-case section → Task 4
- ✓ Domain-wechsel protocol → documented in spec (not implemented, correct)
- ✓ Google Search Console → documented as manual action (not implemented, correct)

**Placeholder scan:** None found.

**Type consistency:** No cross-task type references (pure HTML/SVG).
