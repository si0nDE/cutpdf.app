# Donation Panel — Design Spec
Date: 2026-06-22

## Goal

Monetize cutpdf.app via Ko-Fi donations by inserting a 5-second countdown panel
between PDF generation and download. Friendly and trustworthy — not pushy.
No GDPR-problematic embeds (no Ko-Fi widget, no iframe, no tracking).

## UX Flow

| State | Panel | Download button |
|---|---|---|
| Before generation | hidden | hidden |
| Countdown (0–5 s) | visible + progress bar | hidden |
| Unlocked | visible, static (compact) | visible |

- Countdown is automatic — no "skip" button required.
- After unlock, panel stays as a permanent compact donate line.
- Next PDF generation restarts the countdown.

## HTML

Insert directly after `.button-row`, before `#status` in the left card:

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

## CSS (append to style.css)

```css
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

## JS (app.js)

Replace all instances of `download.style.display = 'block'` (or equivalent)
with a call to `startDonationCountdown()`. Add this function:

```js
function startDonationCountdown() {
  const panel = document.getElementById('donate-panel');
  const bar = document.getElementById('donate-bar');
  const countdownEl = document.getElementById('donate-countdown');
  const download = document.getElementById('download');

  panel.hidden = false;
  bar.style.transform = 'scaleX(1)';

  let remaining = 5;
  countdownEl.textContent = remaining;

  const tick = setInterval(() => {
    remaining -= 1;
    bar.style.transform = `scaleX(${remaining / 5})`;
    countdownEl.textContent = remaining > 0 ? remaining : '';

    if (remaining <= 0) {
      clearInterval(tick);
      download.style.display = 'inline-flex';
      panel.classList.add('donate-panel--done');
    }
  }, 1000);
}
```

## Constraints

- Ko-Fi link: `https://ko-fi.com/simonfieber`
- No Ko-Fi widget, no iframe, no external script — plain `<a>` only
- `rel="noopener noreferrer"` on all external links
- Countdown: 5 seconds, automatic unlock
- No "skip" button — friendly, not aggressive
