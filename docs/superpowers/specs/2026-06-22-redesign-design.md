# cutpdf.app — UI Redesign

**Datum:** 2026-06-22
**Status:** Genehmigt

## Ziel

Das aktuelle Design wirkt generisch (ChatGPT-generierter Glassmorphism-Stil). Ziel ist ein klares, werkzeughaftes Design mit eigenem Charakter — ohne generische Gradienten, ohne Pill-Buttons, ohne Glassmorphism.

## Design-Entscheidungen

| Dimension | Vorher | Nachher |
|-----------|--------|---------|
| Hintergrund | `radial-gradient` dunkel + `backdrop-filter: blur` | `#f1f5f9` (Body), `#fff` (App-Shell) — kein Gradient |
| Farbschema | Dark-first mit Light-Fallback | Light-only |
| Akzentfarbe | `#3b82f6` (generisches Blau) | `#4f46e5` (Indigo) |
| Eckenradius | 999px Pills überall | 6–8px (Inputs/Buttons), 8px (Dropzone), 12px (App-Shell) |
| Status-Anzeige | Status-Pill (Border + Gradient) | Border-left 3px + flacher Hintergrund |
| Glassmorphism | `backdrop-filter`, gestapelte `radial-gradient` | Entfernt |

## Token-System (CSS-Variablen)

```css
--color-bg:        #f1f5f9;   /* Body-Hintergrund */
--color-surface:   #ffffff;   /* Karten, Inputs */
--color-border:    #e5e7eb;   /* Standard-Rahmen */
--color-border-subtle: #f3f4f6; /* Trennlinien */
--color-text:      #111827;   /* Primärtext */
--color-muted:     #6b7280;   /* Sekundärtext, Labels */
--color-accent:    #4f46e5;   /* Indigo — Buttons, Focus, aktive States */
--color-accent-bg: #eef2ff;   /* Indigo-Hintergrund (Badge, Hover) */
--color-accent-border: #c7d2fe; /* Indigo-Rahmen */
--radius-sm:       6px;
--radius-md:       8px;
--radius-lg:       12px;
```

## Layout-Struktur

Unverändert: zwei Spalten (Tool links, Info rechts), responsiv ab 900px einspaltig. App-Shell max 920px zentriert.

## Header

- Links: Wordmark `cutpdf.app` (bold, Indigo-Akzent auf `pdf`) + Privacy-Badge
- Rechts: **leer** (Versionsnummer entfernt)
- Privacy-Badge: `🔒 Lokal · keine Uploads` — Indigo-Variante (kein Gradient)

## Aufteilung — Progressive Disclosure

Standard-Ansicht zeigt nur die Preset-Buttons. Zeilen/Spalten/Seiten-Felder erscheinen ausschließlich wenn **"Eigene… ▾"** aktiv ist.

```
[Halbieren ↕] [Halbieren ↔] [2×2] [3×3] [Eigene… ▾]

▼ nur wenn "Eigene…" aktiv:
  Zeilen  |  Spalten
  Seiten (leer = alle)
```

Beim Klick auf einen anderen Preset (z. B. 2×2) schließen sich die Felder wieder.

## Ausgabeformat — Button-Strip statt Select

```
[Kachelgröße]  [A4 hoch]  [A4 quer]  [Eigenes… ▾]
```

- Standard: **Kachelgröße** aktiv
- "Eigenes… ▾": blendet W/H-Felder (mm) ein
- Skalierung-Select bleibt immer sichtbar

## Erweitert-Toggle

Rand und Überlappung hinter einem **"Erweitert ▾"**-Toggle, standardmäßig geschlossen.

```
Skalierung  [Einpassen ▾]

[Erweitert ▾]
  ▼ wenn geöffnet:
    Rand (mm)  |  Überlappung (mm)
```

## Buttons

| Element | Stil |
|---------|------|
| Primary ("PDF erzeugen") | `background: #4f46e5`, `color: #fff`, `border-radius: 7px` — kein Box-Shadow |
| Secondary ("PDF herunterladen") | `border: 1px solid #d1d5db`, `background: #fff`, `border-radius: 7px` |
| Preset-Buttons | `border: 1px solid #d1d5db`, `border-radius: 6px` — aktiv: Indigo-Variante |
| Format-Buttons | identisch Preset-Buttons |
| Disabled | `background: #a5b4fc` (gedimmtes Indigo) |

## Status-Anzeige

```css
.status          { border-left: 3px solid #e5e7eb; background: #f9fafb; }
.status.ok       { border-left-color: #4f46e5; background: #eef2ff; color: #4338ca; }
.status.err      { border-left-color: #ef4444; background: #fef2f2; color: #b91c1c; }
```

## Footer

- Links: `v0.1.0` als Link → `https://github.com/si0nDE/cutpdf.app` (öffnet in neuem Tab)
- Rechts: Impressum · Datenschutz

## Was entfernt wird

- Alle `radial-gradient`-Hintergründe
- `backdrop-filter: blur(14px)`
- `box-shadow` auf Buttons
- 999px `border-radius` (Pills)
- `@media (prefers-color-scheme: light)` Block (nicht mehr nötig — Light ist jetzt Default)
- Dark-Mode-Variablen (kein Dark Mode in dieser Version)

## Out of Scope

- Dark Mode (kein Bedarf geäußert, kann später ergänzt werden)
- Animationen / Transitions (bestehende bleiben, werden nicht ausgebaut)
- Inhaltliche Änderungen am Tool-Verhalten
