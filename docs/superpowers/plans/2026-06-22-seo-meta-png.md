# SEO Finishing Touches — Meta Tags + PNG og:image

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `author` and `theme-color` meta tags to index.html, generate `og-image.png` from the existing SVG, and update all og:image references to point to the PNG.

**Architecture:** Pure static HTML site — no build system. All changes are direct edits to `index.html` plus a one-time CLI conversion of `og-image.svg` → `og-image.png`. The PNG is committed as a static asset; the SVG stays as source. Both tasks touch `index.html`, so they run sequentially.

**Tech Stack:** HTML, Bash (rsvg-convert / inkscape / ImageMagick)

**User decisions (already made):**
- "Use CLI tool to generate PNG, fallback order: rsvg-convert → inkscape → convert (ImageMagick)"
- "og-image.svg stays in repo as source asset"

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `index.html` | Modify (Task 0) | Add `author` + `theme-color` meta tags |
| `index.html` | Modify (Task 1) | Update og:image, og:image:type, twitter:image to .png |
| `og-image.png` | Create (Task 1) | Generated from og-image.svg, committed as static asset |

---

## Task 0: Add author + theme-color meta tags

**Goal:** Add `<meta name="author">` and `<meta name="theme-color">` to the `<head>` of index.html.

**Files:**
- Modify: `index.html` (after `<meta name="robots">`, around line 9)

**Acceptance Criteria:**
- [ ] `<meta name="author" content="Simon Fieber" />` present in head
- [ ] `<meta name="theme-color" content="#4f46e5" />` present in head
- [ ] Both tags appear after `<meta name="robots">` and before `<link rel="icon">`
- [ ] Changes committed

**Verify:**
```bash
grep -n "author\|theme-color" /Users/simon/Developer/cutpdf.app/index.html
```
Expected output (2 lines):
```
10:  <meta name="author" content="Simon Fieber" />
11:  <meta name="theme-color" content="#4f46e5" />
```
(Exact line numbers may differ slightly.)

**Steps:**

- [ ] **Step 1: Read current head to find insertion point**

Read `index.html`. Find this line (currently around line 9–10):
```html
  <meta name="robots" content="index,follow" />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
```

- [ ] **Step 2: Insert the two new meta tags**

Replace:
```html
  <meta name="robots" content="index,follow" />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
```

With:
```html
  <meta name="robots" content="index,follow" />
  <meta name="author" content="Simon Fieber" />
  <meta name="theme-color" content="#4f46e5" />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
```

- [ ] **Step 3: Verify**

```bash
grep -n "author\|theme-color" /Users/simon/Developer/cutpdf.app/index.html
```
Expected: 2 lines containing `author` and `theme-color`.

- [ ] **Step 4: Commit**

```bash
cd /Users/simon/Developer/cutpdf.app
git add index.html
git commit -m "feat: add author and theme-color meta tags"
```

---

## Task 1: Generate og-image.png + update og:image tags

**Goal:** Convert `og-image.svg` to `og-image.png` (1200×630) using the first available CLI tool, commit the PNG, and update the three og:image-related tags in `index.html` to reference the `.png`.

**Files:**
- Create: `og-image.png`
- Modify: `index.html` (3 tag changes in head)

**Acceptance Criteria:**
- [ ] `og-image.png` exists at repo root, is a valid PNG, 1200×630 px
- [ ] `og:image` tag references `https://cutpdf.fieber-it.com/og-image.png`
- [ ] `og:image:type` tag has `content="image/png"`
- [ ] `twitter:image` tag references `https://cutpdf.fieber-it.com/og-image.png`
- [ ] `og-image.svg` still present (source asset untouched)
- [ ] Both PNG and index.html changes committed

**Verify:**
```bash
sips -g pixelWidth -g pixelHeight /Users/simon/Developer/cutpdf.app/og-image.png
```
Expected:
```
  pixelWidth: 1200
  pixelHeight: 630
```

```bash
grep -n "og-image" /Users/simon/Developer/cutpdf.app/index.html
```
Expected: all og-image references end in `.png`, none end in `.svg`.

**Steps:**

- [ ] **Step 1: Detect available CLI tool and generate PNG**

Run from `/Users/simon/Developer/cutpdf.app`:

```bash
cd /Users/simon/Developer/cutpdf.app

if command -v rsvg-convert &>/dev/null; then
  echo "Using rsvg-convert"
  rsvg-convert -w 1200 -h 630 og-image.svg -o og-image.png
elif command -v inkscape &>/dev/null; then
  echo "Using inkscape"
  inkscape --export-type=png --export-width=1200 --export-height=630 og-image.svg -o og-image.png
elif command -v convert &>/dev/null; then
  echo "Using ImageMagick convert"
  convert -density 150 -resize 1200x630! og-image.svg og-image.png
else
  echo "ERROR: No SVG→PNG converter found."
  echo "Install one: brew install librsvg   (rsvg-convert)"
  echo "         or: brew install inkscape"
  echo "         or: brew install imagemagick"
  exit 1
fi
```

- [ ] **Step 2: Verify PNG dimensions**

```bash
sips -g pixelWidth -g pixelHeight /Users/simon/Developer/cutpdf.app/og-image.png
```
Expected:
```
  pixelWidth: 1200
  pixelHeight: 630
```

If dimensions are wrong (e.g. ImageMagick resized non-uniformly), re-run with explicit dimensions:
```bash
convert -density 150 -resize 1200x630! og-image.svg og-image.png
```
(The `!` forces exact dimensions ignoring aspect ratio.)

- [ ] **Step 3: Update og:image tags in index.html**

Find these three lines in `index.html` (currently referencing `.svg`):
```html
  <meta property="og:image" content="https://cutpdf.fieber-it.com/og-image.svg" />
  <meta property="og:image:type" content="image/svg+xml" />
  <meta name="twitter:image" content="https://cutpdf.fieber-it.com/og-image.svg" />
```

Replace with:
```html
  <meta property="og:image" content="https://cutpdf.fieber-it.com/og-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta name="twitter:image" content="https://cutpdf.fieber-it.com/og-image.png" />
```

- [ ] **Step 4: Verify no .svg references remain for og:image**

```bash
grep -n "og-image" /Users/simon/Developer/cutpdf.app/index.html
```
Expected: all 3 matching lines reference `og-image.png`, none reference `og-image.svg`.

- [ ] **Step 5: Commit**

```bash
cd /Users/simon/Developer/cutpdf.app
git add og-image.png index.html
git commit -m "feat: add og-image.png, switch og:image tags from SVG to PNG"
```

---

## Self-Review

**Spec coverage:**
- ✓ `author` meta tag → Task 0
- ✓ `theme-color` meta tag → Task 0
- ✓ PNG generation via CLI fallback chain → Task 1
- ✓ `og:image` → Task 1
- ✓ `og:image:type` → Task 1
- ✓ `twitter:image` → Task 1
- ✓ `og-image.svg` stays untouched → enforced in Task 1 commit (only `og-image.png` added)

**Placeholder scan:** None.

**Type consistency:** No cross-task type references (pure HTML/Bash).
