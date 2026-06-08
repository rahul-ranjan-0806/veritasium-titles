/**
 * WordAnimation — word and character entrance animations via the Web Animations API.
 * Zero dependencies. Supports *highlighted* words.
 *
 * @example
 * const anim = new WordAnimation('#hero', {
 *   text: 'The speed of *light* is the universe's speed limit',
 *   preset: 'wordFadeUp',
 *   stagger: 55,
 *   duration: 700,
 * })
 * anim.play()
 */

const EASE = {
  outExpo:  'cubic-bezier(0.16, 1, 0.3, 1)',
  outBack:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
  outQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
}

export const WORD_PRESETS = {
  /** Words float up from below with a blur fade. Signature Veritasium look. */
  wordFadeUp: {
    split: 'word',
    frames: () => [
      { opacity: 0, transform: 'translateY(0.55em)', filter: 'blur(6px)' },
      { opacity: 1, transform: 'translateY(0)',      filter: 'blur(0)'  },
    ],
    ease: EASE.outExpo,
  },
  /** Whole words zoom in from a scaled-up blur. */
  blurIn: {
    split: 'word',
    frames: () => [
      { opacity: 0, transform: 'scale(1.18)', filter: 'blur(14px)' },
      { opacity: 1, transform: 'scale(1)',    filter: 'blur(0)'    },
    ],
    ease: EASE.outQuint,
  },
  /** Words slide up from behind a clip mask — clean editorial style. */
  maskReveal: {
    split: 'word',
    setup: tok => { tok.style.overflow = 'hidden' },
    frames: () => [
      { transform: 'translateY(110%)' },
      { transform: 'translateY(0%)'   },
    ],
    ease: EASE.outQuint,
  },
  /** Each character springs in with an overshoot. */
  charPop: {
    split: 'char',
    frames: () => [
      { opacity: 0, transform: 'translateY(0.3em) scale(0.4)' },
      { opacity: 1, transform: 'translateY(0)     scale(1)'   },
    ],
    ease: EASE.outBack,
  },
  /** Words slide in from the left. */
  typeSlide: {
    split: 'word',
    frames: () => [
      { opacity: 0, transform: 'translateX(-0.6em)' },
      { opacity: 1, transform: 'translateX(0)'      },
    ],
    ease: EASE.outExpo,
  },
}

export class WordAnimation {
  /**
   * @param {string|Element} container  CSS selector or DOM element
   * @param {object}         options
   * @param {string}         options.text       Text to animate. Wrap words in *asterisks* to highlight.
   * @param {string}         options.preset     'wordFadeUp' | 'blurIn' | 'maskReveal' | 'charPop' | 'typeSlide'
   * @param {number}         options.stagger    ms delay between each word/char, default 55
   * @param {number}         options.duration   animation duration ms, default 700
   * @param {string}         options.highlight  CSS color for *highlighted* words, default '#ffd34e'
   * @param {Function}       options.onComplete called after all tokens finish animating
   */
  constructor(container, options = {}) {
    this.el = typeof container === 'string' ? document.querySelector(container) : container
    if (!this.el) throw new Error('WordAnimation: container element not found')

    this.opts = {
      text:        options.text        ?? 'Hello World',
      preset:      options.preset      ?? 'wordFadeUp',
      stagger:     options.stagger     ?? 55,
      duration:    options.duration    ?? 700,
      highlight:   options.highlight   ?? '#ffd34e',
      onComplete:  options.onComplete  ?? null,
    }

    this._timers = []
  }

  /** Split the text and animate. Returns a Promise that resolves when the last token finishes. */
  play() {
    this._clear()
    const p       = WORD_PRESETS[this.opts.preset]
    if (!p) throw new Error(`WordAnimation: unknown preset "${this.opts.preset}"`)
    const tokens  = this._split(p.split)
    const stagger = this.opts.stagger
    const dur     = this.opts.duration

    let total = 0
    tokens.forEach((tok, i) => {
      if (p.setup) p.setup(tok)
      const delay = i * stagger
      total = Math.max(total, delay + dur)
      tok.animate(p.frames(), { duration: dur, delay, easing: p.ease, fill: 'both' })
    })

    return new Promise(resolve => {
      const id = setTimeout(() => { this.opts.onComplete?.(); resolve() }, total)
      this._timers.push(id)
    })
  }

  /** Remove all DOM content created by this instance. */
  destroy() {
    this._clear()
  }

  // ── private ────────────────────────────────────────────────────────────────

  _clear() {
    this._timers.forEach(clearTimeout)
    this._timers = []
    this.el.innerHTML = ''
  }

  _split(mode) {
    const highlightColor = this.opts.highlight
    const tokens = []
    const parts  = this.opts.text.split(/(\*[^*]+\*)/g).filter(Boolean)
    const words  = []

    for (const part of parts) {
      const hl    = part.startsWith('*') && part.endsWith('*')
      const clean = hl ? part.slice(1, -1) : part
      for (const w of clean.split(/(\s+)/)) {
        if (w === '') continue
        words.push({ text: w, hl, space: /^\s+$/.test(w) })
      }
    }

    if (mode === 'char') {
      for (const w of words) {
        for (const ch of w.text) {
          const span = document.createElement('span')
          span.style.cssText = 'display:inline-block; white-space:pre;'
          if (w.hl) span.style.color = highlightColor
          span.textContent = ch
          this.el.appendChild(span)
          if (!/\s/.test(ch)) tokens.push(span)
        }
      }
    } else {
      for (const w of words) {
        const span = document.createElement('span')
        span.style.cssText = 'display:inline-block; white-space:pre;'
        if (w.hl) span.style.color = highlightColor
        span.textContent = w.text
        this.el.appendChild(span)
        if (!w.space) tokens.push(span)
      }
    }

    return tokens
  }
}
