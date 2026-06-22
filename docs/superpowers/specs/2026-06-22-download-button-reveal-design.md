# Download Button Reveal Animation — Design Spec
Date: 2026-06-22

## Goal

Make the download button visually unmissable when it appears after the 5-second donation countdown. Users currently miss that the download has unlocked because the button appears silently.

## Solution

Two combined changes: permanent primary color + scale-bounce animation on appearance.

## HTML

Change `#download` class from `btn secondary` to `btn`:

```html
<a id="download" class="btn" style="display:none;" download="tiled.pdf">PDF herunterladen</a>
```

This makes the button permanently the primary accent color (lila/indigo) instead of the muted secondary look — signalling "this is the next action".

## CSS

Add keyframe and reveal class to `style.css`:

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

## JS

In `startDonationCountdown()` in `app.js`, replace the download show logic with:

```js
downloadA.classList.remove('btn--reveal'); // reset so animation replays on 2nd generation
void downloadA.offsetWidth;               // force reflow — required for animation restart
downloadA.style.display = 'inline-block';
downloadA.classList.add('btn--reveal');
```

`void offsetWidth` forces a browser reflow between removing and re-adding the class, ensuring the animation replays correctly when the user generates a second PDF.

## Constraints

- Animation plays once per generation, no loop
- Button stays primary color permanently (not just during animation)
- Works correctly on second/subsequent PDF generations
