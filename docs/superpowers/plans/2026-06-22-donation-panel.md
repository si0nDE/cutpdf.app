# Donation Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Insert a 5-second countdown panel between PDF generation and download unlock, showing a Ko-Fi donation prompt.

**Architecture:** After PDF generation completes, instead of immediately showing the download button, call `startDonationCountdown()` which shows the donate panel, animates a progress bar over 5 seconds, then reveals the download button and collapses the panel to a compact static link. Panel resets when a new file is loaded.

**Tech Stack:** Vanilla HTML/CSS/JS. No external dependencies. No Ko-Fi widget or iframe (GDPR-safe).

**User decisions (already made):**
- "Automatisch" — download unlocks automatically after 5 s, no skip button
- "B" — panel between generate and download buttons, stays as compact line after unlock
- 5-second countdown with visible progress bar and numeric counter
- Ko-Fi link: https://ko-fi.com/simonfieber, plain `<a>` only

---

## File Map

| File | Change |
|---|---|
| `index.html` | Add `#donate-panel` div after `.button-row`, before `#status` |
| `style.css` | Append donate panel styles |
| `app.js` | Add `startDonationCountdown()`, replace line 380, reset panel in `handleSelectedFile` |

---

### Task 1: HTML + CSS — Donate Panel Markup and Styles

**Goal:** Add the donate panel to index.html and its styles to style.css so it renders correctly in all three states (hidden / countdown / done).

**Files:**
- Modify: `index.html` (after `.button-row` div, before `#status` div — around line 119)
- Modify: `style.css` (append at end)

**Acceptance Criteria:**
- [ ] `#donate-panel` exists in DOM, hidden by default (`hidden` attribute)
- [ ] Panel contains `#donate-bar`, `#donate-countdown`, and `<a>` to https://ko-fi.com/simonfieber
- [ ] Ko-Fi link has `target="_blank" rel="noopener noreferrer"`
- [ ] `.donate-panel--done` class hides `.donate-text`, `.donate-bar-track`, `.donate-countdown`
- [ ] Panel fits visually within the left card (same width rhythm as `.button-row`)

**Verify:** Open index.html in browser. Panel invisible. DevTools: `document.getElementById('donate-panel').hidden` → `true`.

**Steps:**

- [ ] **Step 1: Add HTML to index.html**

In `index.html`, find the `<div class="button-row">` block (line ~116). Insert the donate panel div directly after the closing `</div>` of `.button-row`, before `<div id="status" ...>`:

```html
        <div id="donate-panel" class="donate-panel" hidden>
          <p class="donate-text">
            ☕ cutpdf.app ist kostenlos und läuft lokal — keine Daten verlassen dein Gerät.
            Wenn es dir hilft, freue ich mich über einen Kaffee.
          </p>
          <div class="donate-actions">
            <a
              id="donate-link"
              href="https://ko-fi.com/simonfieber"
              target="_blank"
              rel="noopener noreferrer"
              class="btn secondary donate-btn"
            >☕ Kaffee spendieren</a>
            <span id="donate-countdown" class="donate-countdown" aria-live="polite"></span>
          </div>
          <div class="donate-bar-track">
            <div id="donate-bar" class="donate-bar"></div>
          </div>
        </div>
```

- [ ] **Step 2: Append CSS to style.css**

Append at the very end of `style.css`:

```css
/* ── Donate Panel ──────────────────────────────────────────── */
.donate-panel {
  margin-top: 12px;
  padding: 12px 14px;
  background: var(--surface-2, #f8f9fa);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 8px;
}

.donate-text {
  margin: 0 0 10px;
  font-size: 0.85rem;
  color: var(--text-2, #6b7280);
  line-height: 1.4;
}

.donate-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.donate-btn { flex-shrink: 0; }

.donate-countdown {
  font-size: 0.85rem;
  color: var(--text-2, #6b7280);
  min-width: 2ch;
}

.donate-bar-track {
  margin-top: 10px;
  height: 3px;
  background: var(--border, #e5e7eb);
  border-radius: 2px;
  overflow: hidden;
}

.donate-bar {
  height: 100%;
  width: 100%;
  background: var(--accent, #6366f1);
  transform-origin: left;
  transition: transform 1s linear;
}

.donate-panel--done .donate-text { display: none; }
.donate-panel--done .donate-bar-track { display: none; }
.donate-panel--done .donate-countdown { display: none; }
.donate-panel--done .donate-actions { justify-content: flex-end; }
```

- [ ] **Step 3: Check CSS variable names**

Open `style.css` from the top and confirm which CSS variable names are used for surface/border/accent colors. If different from `--surface-2`, `--border`, `--accent` — update the donate panel CSS to match. The fallback values (`#f8f9fa`, `#e5e7eb`, `#6366f1`) work without variables.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: add donate panel HTML and CSS"
```

---

### Task 2: JS Wiring — Countdown Logic and Panel Reset

**Goal:** Wire `startDonationCountdown()` into app.js so the panel runs a 5-second countdown after PDF generation, then reveals the download button, and resets when a new file is loaded.

**Files:**
- Modify: `app.js` (add function near top of file; replace line 380; add reset in `handleSelectedFile`)

**Acceptance Criteria:**
- [ ] After clicking "PDF erzeugen", donate panel appears and countdown runs 5 → 0
- [ ] Progress bar animates from full to empty over 5 seconds
- [ ] Download button appears automatically after countdown ends (no user action needed)
- [ ] Panel collapses to compact Ko-Fi link after countdown ends
- [ ] Loading a new PDF hides the donate panel and download button again
- [ ] Generating a second PDF restarts the countdown from 5

**Verify:** Load a PDF, select a preset, click generate. Panel appears with "5", counts down, download button appears after 5 s. Load a new PDF — panel gone.

**Steps:**

- [ ] **Step 1: Add element reference for donate panel**

Near the top of `app.js`, after the existing `el()` assignments (around line 13), add:

```js
const donatePanelEl  = el('donate-panel');
const donateBarEl    = el('donate-bar');
const donateCountEl  = el('donate-countdown');
```

- [ ] **Step 2: Add `startDonationCountdown()` function**

Add this function after the `setFileInfo()` function (around line 50), before `clampInt`:

```js
function startDonationCountdown() {
  donatePanelEl.hidden = false;
  donatePanelEl.classList.remove('donate-panel--done');
  donateBarEl.style.transform = 'scaleX(1)';
  downloadA.style.display = 'none';

  let remaining = 5;
  donateCountEl.textContent = remaining;

  const tick = setInterval(() => {
    remaining -= 1;
    donateBarEl.style.transform = `scaleX(${remaining / 5})`;
    donateCountEl.textContent = remaining > 0 ? remaining : '';

    if (remaining <= 0) {
      clearInterval(tick);
      downloadA.style.display = 'inline-flex';
      donatePanelEl.classList.add('donate-panel--done');
    }
  }, 1000);
}
```

- [ ] **Step 3: Replace download show in generateBtn handler**

In `app.js` around line 380, find:

```js
    downloadA.style.display = 'inline-block';
```

Replace with:

```js
    startDonationCountdown();
```

Leave the lines before it (`downloadA.href = url`, `downloadA.download = ...`) untouched — the countdown just controls *when* the button becomes visible.

- [ ] **Step 4: Reset panel in `handleSelectedFile`**

In `handleSelectedFile` (around line 145–146), find the block that resets the download button:

```js
  downloadA.style.display = 'none';
  downloadA.removeAttribute('href');
```

After those two lines, add:

```js
  donatePanelEl.hidden = true;
  donatePanelEl.classList.remove('donate-panel--done');
```

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "feat: wire donation countdown — 5 s before download unlocks"
```

---

## Self-Review

**Spec coverage:**
- ✓ 5-second countdown → Task 2
- ✓ Automatic unlock, no skip button → Task 2 (`startDonationCountdown` shows download on tick=0)
- ✓ HTML panel structure → Task 1
- ✓ CSS three states (hidden/countdown/done) → Task 1
- ✓ Ko-Fi plain link, no widget/iframe → Task 1
- ✓ Reset on new file load → Task 2 Step 4
- ✓ Second generation restarts countdown → Task 2 (`classList.remove('donate-panel--done')` in countdown start)

**Placeholders:** None.

**Type consistency:** `donatePanelEl`, `donateBarEl`, `donateCountEl` defined in Task 2 Step 1 and used in Step 2 — consistent.
