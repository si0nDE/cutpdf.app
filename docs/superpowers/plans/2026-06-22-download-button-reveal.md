# Download Button Reveal Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the download button unmissable by giving it primary accent color and a scale-bounce animation when it appears after the donation countdown.

**Architecture:** Three small changes across three files: remove `secondary` class from the download button in HTML, add a CSS keyframe + helper class, update JS to add the animation class when revealing the button.

**Tech Stack:** Vanilla HTML/CSS/JS. No build system.

**User decisions (already made):**
- "Beides" — primary accent color (lila) permanently + scale-bounce animation on appearance
- "A" — scale-bounce: `scale(0.85) → scale(1.05) → scale(1.0)` over ~400ms

---

## File Map

| File | Change |
|---|---|
| `index.html` | Remove `secondary` from `#download` class attribute |
| `style.css` | Add `@keyframes btn-reveal` and `.btn--reveal` |
| `app.js` | Update `startDonationCountdown()` to animate download button on reveal |

---

### Task 1: Download Button Reveal — HTML, CSS, and JS

**Goal:** Make the download button appear with primary accent color and a scale-bounce animation after the donation countdown ends.

**Files:**
- Modify: `index.html` (line ~118 — `#download` anchor tag)
- Modify: `style.css` (append after existing `.btn` rules, around line 356)
- Modify: `app.js` (inside `startDonationCountdown()`, the unlock block around line 76-79)

**Acceptance Criteria:**
- [ ] `#download` has class `btn` only (not `btn secondary`) in HTML source
- [ ] `@keyframes btn-reveal` defined in style.css: 0% `scale(0.85) opacity(0)`, 60% `scale(1.05)`, 100% `scale(1.0) opacity(1)`
- [ ] `.btn--reveal` class applies animation `btn-reveal 0.4s ease-out forwards`
- [ ] JS: `btn--reveal` removed, reflow forced, `btn--reveal` re-added each time countdown completes
- [ ] Generating a second PDF replays the animation (not just first time)
- [ ] Download button is lila/indigo (same as "PDF erzeugen" button) when visible

**Verify:** Open `index.html` in browser. Load PDF, select preset, click generate. After 5 s countdown: download button bounces in with indigo color. Generate again: animation replays.

**Steps:**

- [ ] **Step 1: Update HTML**

In `/Users/simon/Developer/cutpdf.app/index.html`, find:

```html
<a id="download" class="btn secondary" style="display:none;" download="tiled.pdf">PDF herunterladen</a>
```

Change to:

```html
<a id="download" class="btn" style="display:none;" download="tiled.pdf">PDF herunterladen</a>
```

- [ ] **Step 2: Add CSS keyframe and reveal class**

In `/Users/simon/Developer/cutpdf.app/style.css`, append after the `.btn.secondary:hover` block (around line 355), before the donate panel section:

```css
@keyframes btn-reveal {
  0%   { transform: scale(0.85); opacity: 0; }
  60%  { transform: scale(1.05); }
  100% { transform: scale(1.0);  opacity: 1; }
}

.btn--reveal {
  animation: btn-reveal 0.4s ease-out forwards;
}
```

- [ ] **Step 3: Update JS reveal logic**

In `/Users/simon/Developer/cutpdf.app/app.js`, inside `startDonationCountdown()`, find the unlock block (inside `setInterval` when `remaining <= 0`). Currently:

```js
      clearInterval(donateIntervalId);
      donateIntervalId = null;
      downloadA.style.display = 'inline-block';
      donatePanelEl.classList.add('donate-panel--done');
```

Replace with:

```js
      clearInterval(donateIntervalId);
      donateIntervalId = null;
      downloadA.classList.remove('btn--reveal');
      void downloadA.offsetWidth;
      downloadA.style.display = 'inline-block';
      downloadA.classList.add('btn--reveal');
      donatePanelEl.classList.add('donate-panel--done');
```

`void downloadA.offsetWidth` forces a browser reflow between removing and re-adding `.btn--reveal`, ensuring the animation restarts correctly on second generation.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css app.js
git commit -m "feat: bounce-in download button with primary color after countdown"
```

---

## Self-Review

**Spec coverage:**
- ✓ Primary color permanently: Task 1 Step 1 (remove `secondary`)
- ✓ Scale-bounce animation: Task 1 Steps 2-3
- ✓ Replays on second generation: Step 3 (`classList.remove` + reflow before re-add)

**Placeholders:** None — all steps have complete code.

**Type consistency:** `downloadA` used throughout — matches existing variable name in app.js.
