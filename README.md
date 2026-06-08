# Motion Titles

Veritasium / 3Blue1Brown-style text animation studio. Seven animations, zero build steps — open `index.html` in any browser.

## Animations

| Mode | Technique | Dependencies |
|---|---|---|
| **Stroke & Fill** | opentype.js glyph paths → SVG `stroke-dashoffset` → CSS fill transition | opentype.js |
| **Word Fade Up** | Web Animations API, `translateY` + `blur` | none |
| **Blur In** | Web Animations API, `scale` + `blur` | none |
| **Mask Slide Up** | Web Animations API, `overflow:hidden` clip | none |
| **Char Spring Pop** | Web Animations API, per-character `scale` with `outBack` easing | none |
| **Word Slide In** | Web Animations API, `translateX` | none |
| **Handwriting** | Vara.js centerline stroke paths, `stroke-dashoffset` | Vara.js |

## Usage

### As a standalone tool

```
open index.html
```

No server required. Adjust text and controls, hit **Replay**.

### Stroke & Fill — embedding in a project

The core of the stroke+fill animation is ~120 lines of vanilla JS. Copy the following functions from `index.html` or `stroke-fill.html` into your project:

```js
// 1. Load opentype.js (CDN or npm install opentype.js)
// 2. Copy: resolveWeight, loadFont, rotatePathToBottom, commandsToD,
//          animateAllStrokes, buildLineSVG
// 3. Call:
const font = await loadFont('fraunces', 100);
const { svg, glyphPaths } = buildLineSVG(font, 'Hello', 72, 1, '#ffd34e', '#0b0d10');
document.body.appendChild(svg);

const lengths = glyphPaths.map(p => p.getTotalLength());
const dur     = (Math.max(...lengths) / 560) * 1000; // 560 px/s pen speed
animateAllStrokes(glyphPaths, dur, lengths);

setTimeout(() => {
  glyphPaths.forEach(p => {
    p.style.transition = 'fill 400ms ease-out';
    p.style.fill = '#f4f6f8';
  });
}, dur);
```

### Word animations — embedding in a project

Copy `splitText` and `WORD_PRESETS` from `index.html`. Each preset is a plain Web Animations API call — no GSAP, no dependencies.

```js
const tokens = splitText('The speed of *light*', 'word');
tokens.forEach((tok, i) =>
  tok.animate(WORD_PRESETS.wordFadeUp.frames(), {
    duration: 700,
    delay: i * 55,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    fill: 'both',
  })
);
```

## Files

| File | Purpose |
|---|---|
| `index.html` | Unified animation studio — all 7 modes in one UI |
| `stroke-fill.html` | Standalone stroke & fill component |
| `handwriting.html` | Standalone handwriting component |

## How Stroke & Fill works

1. **Font loading** — opentype.js fetches a per-weight `.ttf` from Google Fonts CDN. Fonts cache after first load; only the default (Fraunces 100) loads on startup.
2. **Path rotation** — each glyph's subpaths are rotated so `M` starts at the bottommost point, making the stroke animation begin at the base of every letter.
3. **Single path per glyph** — fill and stroke share one `<path>` element. `paint-order: stroke fill` renders the stroke underneath the fill. During animation `fill = bgColor` masks all interior path segments — only the outer edge of the stroke is visible.
4. **CSS transition animation** — `stroke-dashoffset` animates from `pathLength → 0` via a CSS `transition: linear`. All paths start in one synchronous JS block so the browser batches them as one composited animation.
5. **Fill reveal** — after a configurable delay a single `setTimeout` transitions all glyphs from `bgColor → fillColor` simultaneously.

## Dependencies

| Library | Version | Used for |
|---|---|---|
| [opentype.js](https://github.com/opentypejs/opentype.js) | 1.3.4 | Font parsing and glyph path extraction |
| [Vara.js](https://github.com/akzhy/Vara) | 1.4.1 | Handwriting centerline stroke animation |

All loaded from CDN — no `npm install` needed.
