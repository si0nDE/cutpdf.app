# SEO-Vollausbau cutpdf.fieber-it.com

**Date:** 2026-06-22  
**Status:** Approved  
**Scope:** Technical SEO fixes in index.html + two use-case landing pages

---

## Ziel

cutpdf.fieber-it.com soll von Google und LLMs (ChatGPT, Perplexity, Google AI Overviews) als das kanonische Tool für "PDF schneiden im Browser" auf Deutsch erkannt und empfohlen werden. Keine Uploads, lokal, kostenlos — das sind die zentralen USPs.

---

## Phase 1 — index.html Fixes

### H1 Keyword-Optimierung

**Problem:** Aktuelle H1 ist `cutpdf.app` — nur Brandname, keine Keywords. Google wertet H1 als stärkstes On-Page-Signal.

**Lösung:** H1-Tag um Keywords erweitern, visuell via CSS als Subtitle gestylt:

```html
<h1 class="app-title">
  cut<span class="app-title-accent">pdf</span>
  <span class="app-title-sub"> — PDF schneiden im Browser</span>
</h1>
```

`.app-title-sub` erhält kleinere Schrift (ca. 0.5em der aktuellen H1-Größe), gleiche Farbe aber geringeres Gewicht. Brand bleibt dominant, Keywords werden für SEO lesbar.

### FAQ-Schema (JSON-LD)

Zweiter `<script type="application/ld+json">`-Block mit `@type: FAQPage`:

5 Fragen:
1. Werden meine PDFs auf einen Server hochgeladen? → Nein, vollständig lokal.
2. Welche PDF-Formate werden unterstützt? → Standard PDF, Funktionen erklären.
3. Wie erstelle ich Versandetiketten aus einem A4-PDF? → Schritt-für-Schritt mit 100×150 mm Preset.
4. Ist cutpdf kostenlos? → Ja, Open Source, keine Konten.
5. Wie teile ich ein großes PDF für Posterdruck auf? → Rasterwahl, A4-Ausgabeformat.

Ziel: Rich Results in Google SERPs + LLM-Extraktion.

### WebSite-Schema (JSON-LD)

Dritter JSON-LD-Block mit `@type: WebSite`:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "cutpdf.app",
  "url": "https://cutpdf.fieber-it.com/",
  "description": "PDF schneiden und teilen im Browser — lokal, ohne Upload, kostenlos.",
  "inLanguage": "de"
}
```

Hilft Google, die Site als eigenständige Entität zu erkennen (Voraussetzung für Sitelinks).

### Sonstige Fixes

| Fix | Element |
|---|---|
| `og:image:alt` | `<meta property="og:image:alt" content="cutpdf.app — PDF schneiden und teilen im Browser, lokal ohne Upload" />` |
| `apple-touch-icon` | `<link rel="apple-touch-icon" href="favicon.svg" />` |
| `hreflang de` | `<link rel="alternate" hreflang="de" href="https://cutpdf.fieber-it.com/" />` |
| `hreflang x-default` | `<link rel="alternate" hreflang="x-default" href="https://cutpdf.fieber-it.com/" />` |

### Interne Links zu Unterseiten

Im Abschnitt "Wofür eignet sich cutpdf?" werden die bestehenden `<li>`-Einträge für Labels und Poster zu Links auf `/etiketten/` und `/poster/` umgewandelt.

---

## Phase 2 — Use-Case-Landing-Pages

### Gemeinsame Struktur (beide Seiten)

```
<header>   Brand-Logo (Link → index.html), Badge "Lokal · keine Uploads"
<main>
  <article>
    <h1>         Use-Case-spezifisch
    <section.intro>   2-3 Sätze Kontext
    <section.steps>   Nummerierte Schritt-für-Schritt-Anleitung (4-5 Schritte)
    <section.faq>     4-5 FAQ-Einträge (auch als FAQPage-Schema ausgezeichnet)
    <section.cta>     Button "cutpdf öffnen →" → /index.html
<footer>   Identisch mit index.html (Impressum, Datenschutz, GitHub)
```

Beide Seiten nutzen dasselbe `style.css` (mit `../style.css` referenziert). Neue CSS-Klassen falls nötig werden in `style.css` ergänzt.

**Dateistruktur:** Verzeichnis mit `index.html` statt `.html`-Datei — so ist die URL ohne `.html`-Extension auf allen Static-Hosts erreichbar:

```
cutpdf.app/
  etiketten/
    index.html   → https://cutpdf.fieber-it.com/etiketten/
  poster/
    index.html   → https://cutpdf.fieber-it.com/poster/
```

### `/etiketten/index.html`

**SEO-Meta:**
- `<title>`: `DHL/DPD/Hermes Versandetiketten aus PDF freistellen | cutpdf.app`
- `<meta name="description">`: `Versandetiketten (100×150 mm) aus A4-PDFs freistellen — für DHL, DPD, Hermes. Läuft lokal im Browser, kein Upload, kostenlos.`
- `<link rel="canonical">`: `https://cutpdf.fieber-it.com/etiketten/`
- `og:url`: `https://cutpdf.fieber-it.com/etiketten/`
- `og:title`, `og:description`: entsprechend
- `og:image`: gleiche `og-image.png` wie index.html (absoluter URL)

**H1:** `Versandetiketten aus A4-PDF freistellen`

**Inhalt:**
- Intro: Wofür DHL/DPD/Hermes Labels typischerweise als A4-PDF kommen, was das Problem ist
- Steps: PDF laden → "Halbieren ↕" wählen → Ausgabeformat 100×150 mm → PDF erzeugen → drucken
- FAQ: Label passt nicht / falsche Größe / mehrere Labels auf einer Seite / Skalierungsmodus

**Schema:** `FAQPage` + `WebPage` (mit `isPartOf` → WebSite)

### `/poster/index.html`

**SEO-Meta:**
- `<title>`: `PDF als Poster auf mehrere A4-Seiten aufteilen | cutpdf.app`
- `<meta name="description">`: `Großes PDF oder Bild auf mehrere A4-Seiten aufteilen und als Poster drucken. Kachelraster frei wählbar. Lokal im Browser, kein Upload.`
- `<link rel="canonical">`: `https://cutpdf.fieber-it.com/poster/`
- `og:url`: `https://cutpdf.fieber-it.com/poster/`
- analog zu /etiketten sonst

**H1:** `PDF als Poster auf mehrere A4-Seiten aufteilen`

**Inhalt:**
- Intro: Wann man einen PDF-Posterdruck braucht (Präsentationen, Karten, Designs)
- Steps: PDF laden → Raster wählen (2×2, 3×3 oder eigenes) → A4 hoch als Ausgabe → PDF erzeugen → Seiten ausdrucken und zusammenkleben
- FAQ: Welches Raster für welche Größe / Rand einstellen / Überlappung für Kleben / Skalierungsmodi

**Schema:** `FAQPage` + `WebPage`

---

## Sitemap-Update

`sitemap.xml` erhält zwei neue Einträge:

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
```

---

## Nicht in Scope

- Englische Versionen der Seiten
- Server-seitiges Rendering / Build-System
- Analytics / Tracking
- Dritte Use-Case-Seite (z. B. /split)
- App-Embedding auf Unterseiten

---

## Erfolgskriterien

- Google Rich Results Test zeigt FAQPage-Schema auf allen drei URLs
- H1 auf jeder Seite enthält primäres Keyword
- Alle Canonical-URLs stimmen mit Sitemap überein
- Alle OG-Tags gesetzt, og:image:alt vorhanden
- Interne Verlinkung: index.html → /etiketten, /poster; beide Seiten → index.html
