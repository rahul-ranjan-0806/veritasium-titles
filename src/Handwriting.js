/**
 * Handwriting — centerline stroke-path handwriting animation via Vara.js.
 *
 * @example
 * const anim = new Handwriting('#hero', {
 *   lines: ['why is the sky blue?'],
 *   font: 'satisfy',
 *   color: '#ffd34e',
 *   fontSize: 96,
 * })
 * anim.play()
 */

const FONT_URLS = {
  satisfy:    'https://cdn.jsdelivr.net/gh/akzhy/Vara/fonts/Satisfy/SatisfySL.json',
  pacifico:   'https://cdn.jsdelivr.net/gh/akzhy/Vara/fonts/Pacifico/PacificoSLO.json',
  parisienne: 'https://cdn.jsdelivr.net/gh/akzhy/Vara/fonts/Parisienne/Parisienne.json',
  shadows:    'https://cdn.jsdelivr.net/gh/akzhy/Vara/fonts/Shadows-Into-Light/shadows-into-light.json',
}

const _scriptCache = {}
function _loadScript(src) {
  if (!_scriptCache[src]) {
    _scriptCache[src] = new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
      const s = document.createElement('script')
      s.src = src
      s.onload = resolve
      s.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      document.head.appendChild(s)
    })
  }
  return _scriptCache[src]
}

export class Handwriting {
  /**
   * @param {string|Element} container  CSS selector or DOM element
   * @param {object}         options
   * @param {string[]}       options.lines       Lines of text to write
   * @param {string}         options.font        'satisfy' | 'pacifico' | 'parisienne' | 'shadows'
   * @param {string}         options.color       Stroke color, default '#f4f6f8'
   * @param {number}         options.fontSize    px, default 96
   * @param {number}         options.strokeWidth default 2
   * @param {number}         options.duration    ms per line, default 1600
   * @param {string}         options.textAlign   'left' | 'center' | 'right', default 'center'
   * @param {Function}       options.onComplete  called after all lines finish
   */
  constructor(container, options = {}) {
    if (typeof container === 'string') {
      this._varaTarget = container
      this.el = document.querySelector(container)
    } else {
      // Vara.js requires a CSS selector string — auto-assign an id if the element lacks one
      if (!container.id) container.id = `hw-vara-${Math.random().toString(36).slice(2)}`
      this._varaTarget = '#' + container.id
      this.el = container
    }
    if (!this.el) throw new Error('Handwriting: container element not found')

    this.opts = {
      lines:       options.lines       ?? ['Hello World'],
      font:        options.font        ?? 'satisfy',
      color:       options.color       ?? '#f4f6f8',
      fontSize:    options.fontSize    ?? 96,
      strokeWidth: options.strokeWidth ?? 2,
      duration:    options.duration    ?? 1600,
      textAlign:   options.textAlign   ?? 'center',
      onComplete:  options.onComplete  ?? null,
    }

    this._varaReady = null
    this._vara      = null
  }

  /** Load Vara.js if needed and start writing. Returns a Promise that resolves on completion. */
  async play() {
    await this._getVara()
    this.el.innerHTML = ''

    const { lines, font, color, fontSize, strokeWidth, duration, textAlign } = this.opts

    return new Promise(resolve => {
      this._vara = new Vara(
        this._varaTarget,
        FONT_URLS[font],
        lines.map((text, i) => ({ text, duration, id: `hw-${i}` })),
        { fontSize, strokeWidth, color, textAlign, letterSpacing: 0 }
      )
      this._vara.animationEnd(() => {
        this.opts.onComplete?.()
        resolve()
      })
    })
  }

  /** Remove all DOM content created by this instance. */
  destroy() {
    this.el.innerHTML = ''
    this._vara = null
  }

  // ── private ────────────────────────────────────────────────────────────────

  async _getVara() {
    if (typeof Vara !== 'undefined') return
    if (this._varaReady) return this._varaReady
    this._varaReady = _loadScript('https://cdn.jsdelivr.net/npm/vara@1.4.1/lib/vara.min.js')
    await this._varaReady
  }
}
