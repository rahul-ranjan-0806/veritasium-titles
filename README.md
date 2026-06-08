# motion-titles

Veritasium / 3Blue1Brown-style text animation components. Three classes, no build step required.

- **`StrokeFill`** — SVG contour stroke that fills in. Powered by opentype.js.
- **`WordAnimation`** — word and character entrance animations. Zero dependencies.
- **`Handwriting`** — centerline pen-stroke handwriting. Powered by Vara.js.

**[→ Live React Demo](https://rahul-ranjan-0806.github.io/veritasium-titles/demo.html)** — configure all three animations in the browser, see the equivalent code update live.

---

## Installation

```bash
npm install motion-titles
```

Or via CDN (no install):

```html
<script type="module">
  import { StrokeFill } from 'https://cdn.jsdelivr.net/gh/rahul-ranjan-0806/veritasium-titles@main/src/StrokeFill.js'
</script>
```

---

## StrokeFill

Each letter's contour is drawn simultaneously from its bottommost point, then the fill fades in across the whole phrase.

### Usage

```js
import { StrokeFill } from 'motion-titles'

const anim = new StrokeFill('#hero', {
  lines:        ['The universe has no obligation', 'to make sense to you'],
  font:         'fraunces',   // 'fraunces' | 'roboto' | 'fira' | 'abril'
  weight:       100,          // 100–900, snapped to nearest available
  fontSize:     72,
  strokeColor:  '#ffd34e',
  fillColor:    '#f4f6f8',
  strokeWidth:  1,
  speed:        560,          // px/s — controls how fast the pen travels
  fillDelay:    0,            // ms after strokes end before fill fades in
  fillDuration: 400,          // ms for the fill fade
  background:   '#0b0d10',   // must match your container's background color
  onComplete:   () => console.log('done'),
})

await anim.play()  // returns a Promise
anim.destroy()     // remove SVGs and cancel timers
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `lines` | `string[]` | `['Hello World']` | Each string renders as one SVG line |
| `font` | `string` | `'fraunces'` | Built-in: `'fraunces'` `'roboto'` `'fira'` `'abril'` |
| `weight` | `number` | `100` | CSS font weight, snapped to nearest available for the font |
| `fontSize` | `number` | `72` | px |
| `strokeColor` | `string` | `'#ffd34e'` | Stroke colour during animation |
| `fillColor` | `string` | `'#f4f6f8'` | Final letter fill colour |
| `strokeWidth` | `number` | `1` | px |
| `speed` | `number` | `560` | Pen speed in px/s. Duration = longest glyph path ÷ speed. |
| `fillDelay` | `number` | `0` | ms to wait after strokes finish before fill fades in |
| `fillDuration` | `number` | `400` | ms for the fill fade transition |
| `background` | `string` | `'#000000'` | **Must match your container's background.** Used to mask interior path segments during the stroke phase. |
| `onComplete` | `function` | `null` | Called after fill has fully faded in |

### How the background option works

During the stroke phase, each letter's `fill` is set to `background` (same color as the container). Combined with `paint-order: stroke fill`, the fill layer sits on top of the stroke, masking any interior path segments — so only the outer contour of each letter is visible. Once strokes finish the fill transitions to `fillColor`. If `background` doesn't match your actual background, you'll see colored rectangles behind the letters.

### React

```jsx
import { useEffect, useRef } from 'react'
import { StrokeFill } from 'motion-titles'

export function StrokeFillText({ lines, ...opts }) {
  const ref  = useRef(null)
  const anim = useRef(null)

  useEffect(() => {
    anim.current = new StrokeFill(ref.current, { lines, ...opts })
    anim.current.play()
    return () => anim.current.destroy()
  }, [lines, JSON.stringify(opts)])

  return <div ref={ref} />
}

// Usage:
<StrokeFillText
  lines={['The universe has', 'no obligation']}
  font="fraunces"
  weight={100}
  strokeColor="#ffd34e"
  background="#0b0d10"
/>
```

---

## WordAnimation

Word and character entrance animations using the Web Animations API. No dependencies.
Wrap words in `*asterisks*` to highlight them.

### Usage

```js
import { WordAnimation } from 'motion-titles'

const anim = new WordAnimation('#hero', {
  text:       'The speed of *light* is the universe\'s speed limit',
  preset:     'wordFadeUp',  // see presets below
  stagger:    55,            // ms between each token
  duration:   700,           // ms per token animation
  highlight:  '#ffd34e',     // color for *highlighted* words
  onComplete: () => console.log('done'),
})

await anim.play()
anim.destroy()
```

### Presets

| Preset | Description |
|---|---|
| `wordFadeUp` | Words float up with a blur fade. Classic Veritasium look. |
| `blurIn` | Words zoom in from a scaled-up blur. |
| `maskReveal` | Words slide up from behind a clip mask. Editorial style. |
| `charPop` | Each character springs in individually with an overshoot. |
| `typeSlide` | Words slide in from the left. |

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `'Hello World'` | Wrap words in `*asterisks*` to apply the highlight color |
| `preset` | `string` | `'wordFadeUp'` | See presets table above |
| `stagger` | `number` | `55` | ms delay between each word or character |
| `duration` | `number` | `700` | ms per token animation |
| `highlight` | `string` | `'#ffd34e'` | Color applied to `*highlighted*` words |
| `onComplete` | `function` | `null` | Called after all tokens finish |

### React

```jsx
import { useEffect, useRef } from 'react'
import { WordAnimation } from 'motion-titles'

export function WordAnim({ text, preset = 'wordFadeUp', ...opts }) {
  const ref  = useRef(null)
  const anim = useRef(null)

  useEffect(() => {
    anim.current = new WordAnimation(ref.current, { text, preset, ...opts })
    anim.current.play()
    return () => anim.current.destroy()
  }, [text, preset, JSON.stringify(opts)])

  return (
    <div ref={ref} style={{ fontWeight: 900, fontSize: 'clamp(40px, 8vw, 120px)', lineHeight: 1.05 }} />
  )
}
```

---

## Handwriting

Centerline pen-stroke handwriting animation. Each glyph's path draws with `stroke-dashoffset`. Powered by Vara.js (auto-loaded from CDN if not present).

### Usage

```js
import { Handwriting } from 'motion-titles'

const anim = new Handwriting('#hero', {
  lines:       ['why is the sky blue?'],
  font:        'satisfy',     // see fonts below
  color:       '#ffd34e',
  fontSize:    96,
  strokeWidth: 2,
  duration:    1600,          // ms per line
  textAlign:   'center',
  onComplete:  () => console.log('done'),
})

await anim.play()
anim.destroy()
```

### Fonts

| Key | Style |
|---|---|
| `satisfy` | Fluid signature |
| `pacifico` | Rounded casual |
| `parisienne` | Fine calligraphy |
| `shadows` | Printed hand |

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `lines` | `string[]` | `['Hello World']` | Each string animates as a separate SVG line |
| `font` | `string` | `'satisfy'` | See fonts table above |
| `color` | `string` | `'#f4f6f8'` | Stroke color |
| `fontSize` | `number` | `96` | px |
| `strokeWidth` | `number` | `2` | px |
| `duration` | `number` | `1600` | ms per line |
| `textAlign` | `string` | `'center'` | `'left'` `'center'` `'right'` |
| `onComplete` | `function` | `null` | Called after all lines finish |

### React

```jsx
import { useEffect, useRef } from 'react'
import { Handwriting } from 'motion-titles'

export function HandwritingText({ lines, ...opts }) {
  const ref  = useRef(null)
  const anim = useRef(null)

  useEffect(() => {
    anim.current = new Handwriting(ref.current, { lines, ...opts })
    anim.current.play()
    return () => anim.current.destroy()
  }, [lines, JSON.stringify(opts)])

  return <div ref={ref} style={{ width: 'min(90vw, 900px)' }} />
}
```

---

## Demo

| Link | What it is |
|---|---|
| [React Demo](https://rahul-ranjan-0806.github.io/veritasium-titles/demo.html) | Interactive React prototype — tweak every option, live code snippet updates |
| [Full Studio](https://rahul-ranjan-0806.github.io/veritasium-titles/) | All 7 animation modes including handwriting & word animations |

Or open `index.html` locally in any browser — no server required.

## Files

```
motion-titles/
├── src/
│   ├── StrokeFill.js      importable class
│   ├── WordAnimation.js   importable class
│   └── Handwriting.js     importable class
├── index.js               re-exports all three
├── package.json
├── demo.html              React demo (also served via GitHub Pages)
├── index.html             full animation studio (local)
├── stroke-fill.html       standalone stroke-fill demo
└── handwriting.html       standalone handwriting demo
```

## License

MIT
