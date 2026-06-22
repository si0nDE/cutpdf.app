# SEO-Vollausbau cutpdf.fieber-it.com — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply all identified SEO improvements to cutpdf.fieber-it.com: technical fixes to index.html, and two use-case landing pages (/etiketten/ and /poster/).

**Architecture:** Phase 1 modifies index.html and style.css. Phase 2 creates two subdirectories (etiketten/, poster/), each with their own index.html. All pages share ../style.css via relative path. No build system — static HTML files only.

**Tech Stack:** Static HTML5, shared CSS (style.css), Schema.org JSON-LD

**User decisions:**
- "Beides: Fixes + Use-Case-Seiten" — both index.html technical fixes AND landing pages
- Landing pages are info pages + CTA back to main tool, NOT embedded app instances
- Directory structure (etiketten/index.html) over flat .html files for clean URLs on all static hosts

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `index.html` | H1 keyword span, schemas, og:image:alt, apple-touch-icon, hreflang, internal links |
| Modify | `style.css` | Add `.app-title-sub` styling |
| Create | `etiketten/index.html` | Shipping labels landing page |
| Create | `poster/index.html` | Poster printing landing page |
| Modify | `sitemap.xml` | Add /etiketten/ and /poster/ URLs |

---

## Task 0: index.html SEO Fixes

**Goal:** Apply all technical SEO improvements to index.html and add `.app-title-sub` CSS to style.css.

**Files:**
- Modify: `index.html`
- Modify: `style.css`

**Acceptance Criteria:**
- [ ] H1 (line 64) ends with `<span class="app-title-sub"> — PDF schneiden im Browser</span>`
- [ ] `.app-title-sub` defined in style.css
- [ ] `<meta property="og:image:alt">` present in head
- [ ] `<link rel="apple-touch-icon" href="favicon.svg" />` present in head
- [ ] Two `<link rel="alternate" hreflang>` tags present (de + x-default)
- [ ] Second `<script type="application/ld+json">` block present with FAQPage (5 questions)
- [ ] Third `<script type="application/ld+json">` block present with WebSite
- [ ] "Versandetiketten"-Listeneintrag links to `etiketten/`
- [ ] "Poster drucken"-Listeneintrag links to `poster/`

**Verify:** `open index.html` → Rechtsklick → Seitenquelltext → prüfen: `og:image:alt`, `hreflang`, `FAQPage`, `WebSite`, Links zu etiketten/ und poster/

**Steps:**

- [ ] **Step 1: Update H1 in index.html**

Locate line 64. Change:
```html
      <h1 class="app-title">cut<span class="app-title-accent">pdf</span>.app</h1>
```
To:
```html
      <h1 class="app-title">cut<span class="app-title-accent">pdf</span><span class="app-title-sub"> — PDF schneiden im Browser</span></h1>
```

- [ ] **Step 2: Add `.app-title-sub` to style.css**

After line 64 (`app-title-accent { color: var(--color-accent); }`), insert:
```css
.app-title-sub {
  display: block;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0;
  opacity: 0.6;
}
```

- [ ] **Step 3: Add `og:image:alt` to index.html head**

After line 26 (`<meta name="twitter:image" content="..."/>`), insert:
```html
  <meta property="og:image:alt" content="cutpdf.app — PDF schneiden und teilen im Browser, lokal ohne Upload" />
```

- [ ] **Step 4: Add `apple-touch-icon` to index.html head**

After line 12 (`<link rel="icon" type="image/svg+xml" href="favicon.svg" />`), insert:
```html
  <link rel="apple-touch-icon" href="favicon.svg" />
```

- [ ] **Step 5: Add `hreflang` tags to index.html head**

After line 8 (`<link rel="canonical" href="https://cutpdf.fieber-it.com/" />`), insert:
```html
  <link rel="alternate" hreflang="de" href="https://cutpdf.fieber-it.com/" />
  <link rel="alternate" hreflang="x-default" href="https://cutpdf.fieber-it.com/" />
```

- [ ] **Step 6: Add FAQ JSON-LD block**

After the closing `</script>` of the existing WebApplication JSON-LD block (after line 58), insert:
```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Werden meine PDFs auf einen Server hochgeladen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nein. cutpdf läuft vollständig lokal im Browser. Deine Dateien verlassen nie dein Gerät — kein Upload, keine Cloud, kein Server."
        }
      },
      {
        "@type": "Question",
        "name": "Welche PDF-Formate werden unterstützt?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "cutpdf unterstützt Standard-PDF-Dateien. Das Tool kann PDFs halbieren (horizontal oder vertikal), vierteln (2×2), in beliebige Raster kacheln und auf Ausgabeformate wie A4 oder benutzerdefinierte Maße skalieren."
        }
      },
      {
        "@type": "Question",
        "name": "Wie erstelle ich Versandetiketten aus einem A4-PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PDF laden, 'Halbieren ↕' oder '2×2' wählen, dann Ausgabeformat auf 100×150 mm setzen (für DHL/DPD/Hermes-Labels). Anschließend PDF erzeugen und drucken."
        }
      },
      {
        "@type": "Question",
        "name": "Ist cutpdf kostenlos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, cutpdf ist vollständig kostenlos und Open Source. Es gibt keine Konten, keine Abos und keine Werbung."
        }
      },
      {
        "@type": "Question",
        "name": "Wie teile ich ein großes PDF für den Posterdruck auf?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PDF laden, gewünschtes Raster wählen (z. B. 3×3 für neun A4-Seiten), Ausgabeformat auf A4 hoch setzen, dann PDF erzeugen. Ideal zum Drucken von Postern oder Präsentationsfolien in Originalgröße."
        }
      }
    ]
  }
  </script>
```

- [ ] **Step 7: Add WebSite JSON-LD block**

Directly after the FAQ JSON-LD `</script>`, insert:
```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "cutpdf.app",
    "url": "https://cutpdf.fieber-it.com/",
    "description": "PDF schneiden und teilen im Browser — lokal, ohne Upload, kostenlos.",
    "inLanguage": "de"
  }
  </script>
```

- [ ] **Step 8: Add internal links to use-case section**

In index.html, locate the `<ul>` under "Wofür eignet sich cutpdf?" (lines ~225–229). Change:
```html
          <li>Versandetiketten im Format 100 × 150 mm (DHL, DPD, Hermes) aus A4-PDFs freistellen</li>
          <li>Großformatige Designs auf mehrere A4-Seiten aufteilen und als Poster drucken</li>
```
To:
```html
          <li><a href="etiketten/">Versandetiketten</a> im Format 100 × 150 mm (DHL, DPD, Hermes) aus A4-PDFs freistellen</li>
          <li>Großformatige Designs auf <a href="poster/">mehrere A4-Seiten aufteilen und als Poster drucken</a></li>
```

- [ ] **Step 9: Commit**

```bash
git add index.html style.css
git commit -m "feat: SEO fixes — keyword H1, FAQ/WebSite schema, OG-alt, hreflang, internal links"
```

---

## Task 1: /etiketten/ Landing Page

**Goal:** Create etiketten/index.html — a standalone SEO landing page for the shipping labels use case.

**Files:**
- Create: `etiketten/index.html`

**Acceptance Criteria:**
- [ ] H1: "Versandetiketten aus A4-PDF freistellen"
- [ ] `<title>` contains "DHL/DPD/Hermes" and "cutpdf.app"
- [ ] `<link rel="canonical" href="https://cutpdf.fieber-it.com/etiketten/" />` present
- [ ] FAQPage JSON-LD present with 5 questions
- [ ] WebPage JSON-LD with `isPartOf` pointing to WebSite present
- [ ] Step-by-step list with 100×150 mm setting present
- [ ] CTA button `<a href="../" class="btn">` present
- [ ] `<link rel="stylesheet" href="../style.css" />` (relative path)
- [ ] Page renders without broken CSS in browser

**Verify:** `open etiketten/index.html` in browser → page displays with correct heading and layout → Seitenquelltext → confirm canonical `https://cutpdf.fieber-it.com/etiketten/` and both JSON-LD blocks

**Steps:**

- [ ] **Step 1: Create directory**

```bash
mkdir -p etiketten
```

- [ ] **Step 2: Create etiketten/index.html**

Create `etiketten/index.html` with this complete content:

```html
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DHL/DPD/Hermes Versandetiketten aus PDF freistellen | cutpdf.app</title>
  <meta name="description" content="Versandetiketten (100×150 mm) aus A4-PDFs freistellen — für DHL, DPD, Hermes. Läuft lokal im Browser, kein Upload, kostenlos." />
  <link rel="canonical" href="https://cutpdf.fieber-it.com/etiketten/" />
  <link rel="alternate" hreflang="de" href="https://cutpdf.fieber-it.com/etiketten/" />
  <link rel="alternate" hreflang="x-default" href="https://cutpdf.fieber-it.com/etiketten/" />
  <meta name="robots" content="index,follow" />
  <meta name="author" content="Simon Fieber" />
  <meta name="theme-color" content="#4f46e5" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="apple-touch-icon" href="../favicon.svg" />
  <meta property="og:title" content="DHL/DPD/Hermes Versandetiketten aus PDF freistellen | cutpdf.app" />
  <meta property="og:description" content="Versandetiketten (100×150 mm) aus A4-PDFs freistellen — für DHL, DPD, Hermes. Läuft lokal im Browser, kein Upload, kostenlos." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://cutpdf.fieber-it.com/etiketten/" />
  <meta property="og:locale" content="de_DE" />
  <meta property="og:site_name" content="cutpdf.app" />
  <meta property="og:image" content="https://cutpdf.fieber-it.com/og-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="cutpdf.app — PDF schneiden und teilen im Browser, lokal ohne Upload" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Versandetiketten aus PDF freistellen | cutpdf.app" />
  <meta name="twitter:description" content="100×150 mm Labels aus A4-PDFs — lokal, kein Upload." />
  <meta name="twitter:image" content="https://cutpdf.fieber-it.com/og-image.png" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Versandetiketten aus PDF freistellen",
    "description": "Versandetiketten (100×150 mm) aus A4-PDFs freistellen — für DHL, DPD, Hermes. Läuft lokal im Browser, kein Upload, kostenlos.",
    "url": "https://cutpdf.fieber-it.com/etiketten/",
    "inLanguage": "de",
    "isPartOf": {
      "@type": "WebSite",
      "name": "cutpdf.app",
      "url": "https://cutpdf.fieber-it.com/"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Muss ich mein PDF auf einen Server hochladen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nein. cutpdf läuft vollständig lokal im Browser. Deine Datei verlässt zu keiner Zeit dein Gerät — kein Upload, keine Cloud."
        }
      },
      {
        "@type": "Question",
        "name": "Welches Format haben DHL-, DPD- und Hermes-Versandetiketten?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Versandetiketten werden meist im Format 100×150 mm ausgegeben. DHL Paket liefert oft 2 Labels pro A4-Seite, DPD oft 4 Labels pro A4-Seite. In cutpdf das passende Raster wählen und das Ausgabeformat auf 100×150 mm einstellen."
        }
      },
      {
        "@type": "Question",
        "name": "Das Etikett ist zu groß oder zu klein — wie passe ich die Skalierung an?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Skalierungsmodus auf 'Einpassen' stellen — das Etikett wird dann vollständig auf die Zielgröße skaliert. Für volle Flächennutzung mit eventuellem Beschnitt 'Ausfüllen' wählen."
        }
      },
      {
        "@type": "Question",
        "name": "Wie hole ich mehrere Labels gleichzeitig aus einer PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Das passende Raster wählen: 'Halbieren ↕' für 2 Labels pro Seite, '2×2' für 4 Labels. Ausgabeformat auf 100×150 mm einstellen und PDF erzeugen. Jede Kachel wird zur eigenen PDF-Seite."
        }
      },
      {
        "@type": "Question",
        "name": "Mit welchen Programmen kann ich das fertige PDF drucken?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Das erzeugte PDF ist ein Standard-PDF und lässt sich mit Adobe Acrobat, Apple Preview, dem Windows-PDF-Viewer oder jedem anderen PDF-Programm öffnen und drucken."
        }
      }
    ]
  }
  </script>
  <link rel="stylesheet" href="../style.css" />
</head>
<body>
  <div class="app">
    <header class="app-header">
      <a href="../" class="app-title" style="text-decoration:none; color:inherit;">cut<span class="app-title-accent">pdf</span><span class="app-title-sub"> — PDF schneiden im Browser</span></a>
      <div class="badge">🔒 Lokal · keine Uploads</div>
    </header>

    <main class="app-main" style="display:block; max-width:680px; margin:0 auto;">
      <article class="card" style="width:100%; box-sizing:border-box;">

        <div class="card-header">
          <h1 class="card-title" style="font-size:1.15rem; font-weight:700;">Versandetiketten aus A4-PDF freistellen</h1>
        </div>

        <p class="note" style="margin:0 0 16px;">
          Viele Paketdienste liefern Versandetiketten als A4-PDF — oft mit zwei oder vier Labels pro Seite.
          Mit cutpdf schneidest du die Labels direkt im Browser heraus und erhältst ein druckfertiges PDF im Format 100×150 mm.
          Kein Upload, kein Konto, kostenlos.
        </p>

        <div class="divider"></div>

        <div class="card-header">
          <h2 class="card-title">Schritt für Schritt</h2>
        </div>

        <ol class="note" style="margin:0 0 16px; padding-left:18px; line-height:1.75;">
          <li>PDF mit den Versandetiketten in <a href="../">cutpdf</a> öffnen (Datei hineinziehen oder klicken)</li>
          <li>Raster wählen: <strong>Halbieren ↕</strong> für 2 Labels pro Seite oder <strong>2×2</strong> für 4 Labels pro Seite</li>
          <li>Unter <strong>Ausgabeformat</strong> → <strong>Eigenes …</strong> → Breite <strong>100 mm</strong>, Höhe <strong>150 mm</strong> eingeben</li>
          <li>Skalierung auf <strong>Einpassen</strong> lassen</li>
          <li><strong>PDF erzeugen</strong> → <strong>PDF herunterladen</strong> → drucken</li>
        </ol>

        <div class="divider"></div>

        <div class="card-header">
          <h2 class="card-title">Häufige Fragen</h2>
        </div>

        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Muss ich mein PDF hochladen?</summary>
          <p style="margin:8px 0 0;">Nein. cutpdf läuft vollständig lokal im Browser. Deine Datei verlässt zu keiner Zeit dein Gerät — kein Upload, keine Cloud.</p>
        </details>
        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Welches Format haben DHL-, DPD- und Hermes-Labels?</summary>
          <p style="margin:8px 0 0;">Meist 100×150 mm. DHL Paket liefert oft 2 Labels pro A4-Seite, DPD oft 4 Labels pro Seite. Das passende Raster in cutpdf wählen und Ausgabe auf 100×150 mm einstellen.</p>
        </details>
        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Etikett zu groß oder zu klein — was tun?</summary>
          <p style="margin:8px 0 0;">Skalierungsmodus auf „Einpassen" stellen. Das Etikett wird dann vollständig auf die Zielgröße skaliert. Für volle Fläche mit Beschnitt „Ausfüllen" wählen.</p>
        </details>
        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Mehrere Labels gleichzeitig aus einer PDF?</summary>
          <p style="margin:8px 0 0;">„Halbieren ↕" für 2 Labels, „2×2" für 4 Labels wählen → Ausgabeformat 100×150 mm → PDF erzeugen. Jede Kachel wird zur eigenen PDF-Seite.</p>
        </details>
        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Mit welchem Programm drucken?</summary>
          <p style="margin:8px 0 0;">Das erzeugte PDF ist ein Standard-PDF: Adobe Acrobat, Apple Preview, der Windows-PDF-Viewer oder jedes andere PDF-Programm funktioniert.</p>
        </details>

        <div class="divider"></div>

        <div class="button-row">
          <a href="../" class="btn">cutpdf öffnen →</a>
        </div>

      </article>
    </main>

    <footer class="app-footer">
      <div class="footer-left">
        <a href="https://github.com/si0nDE/cutpdf.app" target="_blank" rel="noopener noreferrer" class="footer-version" aria-label="GitHub-Projekt cutpdf.app">cutpdf.app</a>
      </div>
      <div class="footer-right">
        <a href="https://ko-fi.com/simonfieber" target="_blank" rel="noopener noreferrer">☕ Spenden</a>
        <span class="footer-separator">·</span>
        <a href="https://fieber-it.com/impressum" target="_blank" rel="noopener noreferrer">Impressum</a>
        <span class="footer-separator">·</span>
        <a href="https://fieber-it.com/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutz</a>
      </div>
    </footer>
  </div>
</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add etiketten/index.html
git commit -m "feat: add /etiketten/ landing page for shipping labels use case"
```

---

## Task 2: /poster/ Landing Page

**Goal:** Create poster/index.html — a standalone SEO landing page for the poster/large format printing use case.

**Files:**
- Create: `poster/index.html`

**Acceptance Criteria:**
- [ ] H1: "PDF als Poster auf mehrere A4-Seiten aufteilen"
- [ ] `<title>` contains "Poster" and "cutpdf.app"
- [ ] `<link rel="canonical" href="https://cutpdf.fieber-it.com/poster/" />` present
- [ ] FAQPage JSON-LD present with 5 questions (incl. poster size calculation and overlap explanation)
- [ ] WebPage JSON-LD with `isPartOf` present
- [ ] Step-by-step list mentions overlap (Überlappung) setting in Erweitert
- [ ] CTA button `<a href="../" class="btn">` present
- [ ] `<link rel="stylesheet" href="../style.css" />` (relative path)
- [ ] Page renders without broken CSS in browser

**Verify:** `open poster/index.html` in browser → page displays with correct heading and layout → Seitenquelltext → confirm canonical `https://cutpdf.fieber-it.com/poster/` and both JSON-LD blocks

**Steps:**

- [ ] **Step 1: Create directory**

```bash
mkdir -p poster
```

- [ ] **Step 2: Create poster/index.html**

Create `poster/index.html` with this complete content:

```html
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PDF als Poster auf mehrere A4-Seiten aufteilen | cutpdf.app</title>
  <meta name="description" content="Großes PDF oder Design auf mehrere A4-Seiten aufteilen und als Poster drucken. Kachelraster frei wählbar. Lokal im Browser, kein Upload, kostenlos." />
  <link rel="canonical" href="https://cutpdf.fieber-it.com/poster/" />
  <link rel="alternate" hreflang="de" href="https://cutpdf.fieber-it.com/poster/" />
  <link rel="alternate" hreflang="x-default" href="https://cutpdf.fieber-it.com/poster/" />
  <meta name="robots" content="index,follow" />
  <meta name="author" content="Simon Fieber" />
  <meta name="theme-color" content="#4f46e5" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="apple-touch-icon" href="../favicon.svg" />
  <meta property="og:title" content="PDF als Poster auf mehrere A4-Seiten aufteilen | cutpdf.app" />
  <meta property="og:description" content="Großes PDF oder Design auf mehrere A4-Seiten aufteilen und als Poster drucken. Kachelraster frei wählbar. Lokal im Browser, kein Upload, kostenlos." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://cutpdf.fieber-it.com/poster/" />
  <meta property="og:locale" content="de_DE" />
  <meta property="og:site_name" content="cutpdf.app" />
  <meta property="og:image" content="https://cutpdf.fieber-it.com/og-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="cutpdf.app — PDF schneiden und teilen im Browser, lokal ohne Upload" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="PDF als Poster drucken — A4-Kacheln | cutpdf.app" />
  <meta name="twitter:description" content="PDF auf mehrere A4-Seiten aufteilen — lokal, kein Upload." />
  <meta name="twitter:image" content="https://cutpdf.fieber-it.com/og-image.png" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "PDF als Poster auf mehrere A4-Seiten aufteilen",
    "description": "Großes PDF oder Design auf mehrere A4-Seiten aufteilen und als Poster drucken. Kachelraster frei wählbar. Lokal im Browser, kein Upload, kostenlos.",
    "url": "https://cutpdf.fieber-it.com/poster/",
    "inLanguage": "de",
    "isPartOf": {
      "@type": "WebSite",
      "name": "cutpdf.app",
      "url": "https://cutpdf.fieber-it.com/"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Muss ich mein PDF auf einen Server hochladen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nein. cutpdf läuft vollständig lokal im Browser. Deine Datei verlässt zu keiner Zeit dein Gerät — kein Upload, keine Cloud."
        }
      },
      {
        "@type": "Question",
        "name": "Wie groß wird mein Poster bei einem 2×2- oder 3×3-Raster?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bei A4-Papier: Ein 2×2-Raster ergibt ca. 42×59 cm (2×DIN-A4-Breite × 2×DIN-A4-Höhe). Ein 3×3-Raster ergibt ca. 63×89 cm. Für andere Papierformate das Ausgabeformat unter 'Eigenes …' in mm einstellen."
        }
      },
      {
        "@type": "Question",
        "name": "Wie klebe ich die gedruckten Seiten zusammen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unter 'Erweitert' eine Überlappung (z. B. 10–15 mm) aktivieren. Benachbarte Kacheln überlappen sich dann um diesen Wert — das ergibt eine Klebefläche. Alle Seiten drucken, an einem Blatt den Überlappungsstreifen abschneiden, dann zusammenkleben."
        }
      },
      {
        "@type": "Question",
        "name": "Mein gedrucktes Poster wird unscharf — warum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Quell-PDF hat zu geringe Auflösung. cutpdf kann keine Auflösung hinzufügen. Für scharfen Posterdruck sollte die Quell-PDF mindestens 150–300 dpi aufweisen."
        }
      },
      {
        "@type": "Question",
        "name": "Kann ich auf andere Papierformate als A4 ausgeben?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja. Unter 'Ausgabeformat' → 'Eigenes …' Breite und Höhe in mm frei eingeben — z. B. A3, US Letter oder jedes andere Format."
        }
      }
    ]
  }
  </script>
  <link rel="stylesheet" href="../style.css" />
</head>
<body>
  <div class="app">
    <header class="app-header">
      <a href="../" class="app-title" style="text-decoration:none; color:inherit;">cut<span class="app-title-accent">pdf</span><span class="app-title-sub"> — PDF schneiden im Browser</span></a>
      <div class="badge">🔒 Lokal · keine Uploads</div>
    </header>

    <main class="app-main" style="display:block; max-width:680px; margin:0 auto;">
      <article class="card" style="width:100%; box-sizing:border-box;">

        <div class="card-header">
          <h1 class="card-title" style="font-size:1.15rem; font-weight:700;">PDF als Poster auf mehrere A4-Seiten aufteilen</h1>
        </div>

        <p class="note" style="margin:0 0 16px;">
          Mit cutpdf teilst du ein PDF oder ein großformatiges Design direkt im Browser auf mehrere A4-Seiten auf —
          ideal, um Poster, Karten oder Präsentationsfolien in Originalgröße zu drucken.
          Kein Upload, kein Konto, kostenlos.
        </p>

        <div class="divider"></div>

        <div class="card-header">
          <h2 class="card-title">Schritt für Schritt</h2>
        </div>

        <ol class="note" style="margin:0 0 16px; padding-left:18px; line-height:1.75;">
          <li>PDF in <a href="../">cutpdf</a> öffnen (Datei hineinziehen oder klicken)</li>
          <li>Raster wählen: <strong>2×2</strong> für 4 A4-Seiten, <strong>3×3</strong> für 9 A4-Seiten, oder unter <strong>Eigene …</strong> ein freies Raster eingeben</li>
          <li>Ausgabeformat auf <strong>A4 hoch</strong> setzen</li>
          <li>Optional: unter <strong>Erweitert</strong> eine <strong>Überlappung</strong> (z. B. 10 mm) einstellen — ergibt eine Klebefläche beim Zusammensetzen</li>
          <li><strong>PDF erzeugen</strong> → <strong>PDF herunterladen</strong> → alle Seiten drucken → zusammenkleben</li>
        </ol>

        <div class="divider"></div>

        <div class="card-header">
          <h2 class="card-title">Häufige Fragen</h2>
        </div>

        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Muss ich mein PDF hochladen?</summary>
          <p style="margin:8px 0 0;">Nein. cutpdf läuft vollständig lokal im Browser. Deine Datei verlässt zu keiner Zeit dein Gerät — kein Upload, keine Cloud.</p>
        </details>
        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Wie groß wird mein Poster?</summary>
          <p style="margin:8px 0 0;">Bei A4-Papier: 2×2-Raster → ca. 42×59 cm. 3×3-Raster → ca. 63×89 cm. Für andere Formate unter „Ausgabeformat" → „Eigenes …" Breite und Höhe in mm eingeben.</p>
        </details>
        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Wie klebe ich die Seiten zusammen?</summary>
          <p style="margin:8px 0 0;">Unter „Erweitert" eine Überlappung (z. B. 10–15 mm) einstellen. Alle Seiten drucken, an einem Blatt den Überlappungsstreifen abschneiden, dann zusammenkleben.</p>
        </details>
        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Mein Poster wird unscharf gedruckt — warum?</summary>
          <p style="margin:8px 0 0;">Die Quell-PDF hat zu geringe Auflösung. cutpdf kann keine Auflösung hinzufügen. Für Posterdruck mindestens 150–300 dpi im Ursprungsdokument verwenden.</p>
        </details>
        <details class="note" style="margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:600;">Kann ich auf andere Papierformate als A4 ausgeben?</summary>
          <p style="margin:8px 0 0;">Ja. Unter „Ausgabeformat" → „Eigenes …" Breite und Höhe in mm frei eingeben — z. B. A3, US Letter oder jedes andere Format.</p>
        </details>

        <div class="divider"></div>

        <div class="button-row">
          <a href="../" class="btn">cutpdf öffnen →</a>
        </div>

      </article>
    </main>

    <footer class="app-footer">
      <div class="footer-left">
        <a href="https://github.com/si0nDE/cutpdf.app" target="_blank" rel="noopener noreferrer" class="footer-version" aria-label="GitHub-Projekt cutpdf.app">cutpdf.app</a>
      </div>
      <div class="footer-right">
        <a href="https://ko-fi.com/simonfieber" target="_blank" rel="noopener noreferrer">☕ Spenden</a>
        <span class="footer-separator">·</span>
        <a href="https://fieber-it.com/impressum" target="_blank" rel="noopener noreferrer">Impressum</a>
        <span class="footer-separator">·</span>
        <a href="https://fieber-it.com/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutz</a>
      </div>
    </footer>
  </div>
</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add poster/index.html
git commit -m "feat: add /poster/ landing page for large format / poster printing use case"
```

---

## Task 3: Sitemap Update + Push

**Goal:** Add /etiketten/ and /poster/ to sitemap.xml, validate XML, push all commits.

**Files:**
- Modify: `sitemap.xml`

**Acceptance Criteria:**
- [ ] `<loc>https://cutpdf.fieber-it.com/etiketten/</loc>` present in sitemap.xml
- [ ] `<loc>https://cutpdf.fieber-it.com/poster/</loc>` present in sitemap.xml
- [ ] `xmllint --noout sitemap.xml` exits 0
- [ ] All 4 commits pushed to origin/main

**Verify:** `xmllint --noout sitemap.xml && echo "valid"` → `valid`

**Steps:**

- [ ] **Step 1: Update sitemap.xml**

The current sitemap.xml ends with:
```xml
</urlset>
```

Replace that closing tag with the two new entries + closing tag:
```xml
  <url>
    <loc>https://cutpdf.fieber-it.com/etiketten/</loc>
    <lastmod>2026-06-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cutpdf.fieber-it.com/poster/</loc>
    <lastmod>2026-06-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Validate XML**

```bash
xmllint --noout sitemap.xml && echo "valid"
```
Expected output: `valid`

- [ ] **Step 3: Commit and push**

```bash
git add sitemap.xml
git commit -m "feat: add /etiketten/ and /poster/ to sitemap.xml"
git push origin main
```
