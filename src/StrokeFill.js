/**
 * StrokeFill — Veritasium/3b1b-style SVG stroke-then-fill text animation.
 *
 * @example
 * const anim = new StrokeFill('#hero', {
 *   lines: ['The universe has', 'no obligation'],
 *   font: 'fraunces', weight: 100,
 *   strokeColor: '#ffd34e', background: '#0b0d10',
 * })
 * anim.play()
 */

const FONT_URLS = {
  roboto: {
    100: 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbGmT.ttf',
    200: 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuZEbWmT.ttf',
    300: 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuaabWmT.ttf',
    400: 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmT.ttf',
    500: 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWub2bWmT.ttf',
    600: 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYaammT.ttf',
    700: 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjammT.ttf',
    800: 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuZEammT.ttf',
    900: 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuZtammT.ttf',
  },
  abril: {
    400: 'https://fonts.gstatic.com/s/abrilfatface/v25/zOL64pLDlL1D99S8g8PtiKchm-A.ttf',
  },
  fira: {
    300: 'https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnPKruQQ.ttf',
    400: 'https://fonts.gstatic.com/s/firasans/v18/va9E4kDNxMZdWfMOD5VfkA.ttf',
    500: 'https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnZKvuQQ.ttf',
    600: 'https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnSKzuQQ.ttf',
    700: 'https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnLK3uQQ.ttf',
    800: 'https://fonts.gstatic.com/s/firasans/v18/va9B4kDNxMZdWfMOD5VnMK7uQQ.ttf',
  },
  fraunces: {
    100: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIctxqjDg.ttf',
    200: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIcNxujDg.ttf',
    300: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIc6RujDg.ttf',
    400: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIctxujDg.ttf',
    500: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIchRujDg.ttf',
    600: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIcaRyjDg.ttf',
    700: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIcUByjDg.ttf',
    800: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIcNxyjDg.ttf',
    900: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIcHhyjDg.ttf',
  },
}

// Shared cache — persists across instances so switching weights re-uses loaded files
const _fontCache = {}

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

function _resolveWeight(name, target) {
  const keys = Object.keys(FONT_URLS[name]).map(Number)
  return keys.reduce((a, b) => Math.abs(b - target) < Math.abs(a - target) ? b : a)
}

async function _loadFont(name, weight, ot) {
  const w   = _resolveWeight(name, weight)
  const key = `${name}-${w}`
  if (_fontCache[key]) return _fontCache[key]
  const url = FONT_URLS[name][w]
  const f   = await new Promise((res, rej) =>
    ot.load(url, (err, font) => err ? rej(err) : res(font)))
  _fontCache[key] = f
  return f
}

function _getEndpoint(cmd) {
  return (cmd.type !== 'Z' && 'x' in cmd) ? { x: cmd.x, y: cmd.y } : null
}

function _rotateSubpathToBottom(cmds) {
  const hasZ    = cmds[cmds.length - 1].type === 'Z'
  const drawing = hasZ ? cmds.slice(0, -1) : [...cmds]
  if (drawing.length < 3) return cmds
  let maxY = -Infinity, maxIdx = 0
  for (let i = 0; i < drawing.length; i++) {
    const ep = _getEndpoint(drawing[i])
    if (ep && ep.y > maxY) { maxY = ep.y; maxIdx = i }
  }
  if (maxIdx === 0) return cmds
  const newStart = _getEndpoint(drawing[maxIdx])
  if (!newStart) return cmds
  const origM = drawing[0]
  const out   = [
    { type: 'M', x: newStart.x, y: newStart.y },
    ...drawing.slice(maxIdx + 1),
    { type: 'L', x: origM.x, y: origM.y },
    ...drawing.slice(1, maxIdx + 1),
  ]
  if (hasZ) out.push({ type: 'Z' })
  return out
}

function _rotatePathToBottom(commands) {
  const subpaths = []; let current = []
  for (const cmd of commands) {
    if (cmd.type === 'M' && current.length > 0) { subpaths.push(current); current = [] }
    current.push({ ...cmd })
  }
  if (current.length > 0) subpaths.push(current)
  return subpaths.flatMap(_rotateSubpathToBottom)
}

function _commandsToD(commands) {
  return commands.map(cmd => {
    const f = n => n.toFixed(2)
    switch (cmd.type) {
      case 'M': return `M${f(cmd.x)},${f(cmd.y)}`
      case 'L': return `L${f(cmd.x)},${f(cmd.y)}`
      case 'C': return `C${f(cmd.x1)},${f(cmd.y1)} ${f(cmd.x2)},${f(cmd.y2)} ${f(cmd.x)},${f(cmd.y)}`
      case 'Q': return `Q${f(cmd.x1)},${f(cmd.y1)} ${f(cmd.x)},${f(cmd.y)}`
      case 'Z': return 'Z'
      default:  return ''
    }
  }).join(' ')
}

export class StrokeFill {
  /**
   * @param {string|Element} container  CSS selector or DOM element to render into
   * @param {object}         options
   * @param {string[]}       options.lines         Text lines to animate
   * @param {string}         options.font          'fraunces' | 'roboto' | 'fira' | 'abril'
   * @param {number}         options.weight        100–900 (snapped to nearest available)
   * @param {number}         options.fontSize      px, default 72
   * @param {string}         options.strokeColor   default '#ffd34e'
   * @param {string}         options.fillColor     default '#f4f6f8'
   * @param {number}         options.strokeWidth   default 1
   * @param {number}         options.speed         px/s pen speed, default 560
   * @param {number}         options.fillDelay     ms after stroke ends before fill fades in, default 0
   * @param {number}         options.fillDuration  fill fade duration ms, default 400
   * @param {string}         options.background    must match your container's background color
   *                                               (used to mask interior path segments during stroke phase)
   * @param {Function}       options.onComplete    called when fill has fully faded in
   */
  constructor(container, options = {}) {
    this.el = typeof container === 'string' ? document.querySelector(container) : container
    if (!this.el) throw new Error('StrokeFill: container element not found')

    this.opts = {
      lines:        options.lines        ?? ['Hello World'],
      font:         options.font         ?? 'fraunces',
      weight:       options.weight       ?? 100,
      fontSize:     options.fontSize     ?? 72,
      strokeColor:  options.strokeColor  ?? '#ffd34e',
      fillColor:    options.fillColor    ?? '#f4f6f8',
      strokeWidth:  options.strokeWidth  ?? 1,
      speed:        options.speed        ?? 560,
      fillDelay:    options.fillDelay    ?? 0,
      fillDuration: options.fillDuration ?? 400,
      background:   options.background   ?? '#000000',
      onComplete:   options.onComplete   ?? null,
    }

    this._timers   = []
    this._otReady  = null
  }

  /** Load fonts and start the animation. Returns a Promise that resolves when complete. */
  async play() {
    const ot = await this._getOpentype()
    this._clear()

    const { lines, font, weight, fontSize, strokeColor, strokeWidth,
            fillColor, fillDuration, fillDelay, speed, background } = this.opts

    const loadedFont = await _loadFont(font, weight, ot)

    const svgNS  = 'http://www.w3.org/2000/svg'
    const built  = lines.map(line => this._buildLine(loadedFont, line, fontSize, strokeWidth, strokeColor, background, svgNS))

    const maxW   = Math.max(...built.map(b => b.width), 1)
    const lineH  = built[0]?.lineH ?? fontSize
    const totalH = lineH * built.length

    // Single SVG: all lines share one viewBox so center-alignment is exact
    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('viewBox', `0 0 ${maxW.toFixed(2)} ${totalH.toFixed(2)}`)
    svg.setAttribute('width',   maxW)
    svg.setAttribute('height',  totalH)
    svg.style.cssText = 'display:block; margin:0 auto; max-width:100%; height:auto'

    built.forEach(({ g, width, ascender }, i) => {
      const xOff = ((maxW - width) / 2).toFixed(2)
      const yOff = (i * lineH + ascender).toFixed(2)
      g.setAttribute('transform', `translate(${xOff},${yOff})`)
      svg.appendChild(g)
    })

    this.el.appendChild(svg)

    const allPaths = built.flatMap(b => b.glyphPaths)
    const lengths  = allPaths.map(p => p.getTotalLength())
    const strokeMs = (Math.max(...lengths, 1) / speed) * 1000

    this._animateStrokes(allPaths, strokeMs, lengths)

    return new Promise(resolve => {
      const id = setTimeout(() => {
        allPaths.forEach(p => {
          p.style.willChange = 'auto'
          p.style.transition = `fill ${fillDuration}ms ease-out`
          p.style.fill       = fillColor
        })
        const doneId = setTimeout(() => {
          this.opts.onComplete?.()
          resolve()
        }, fillDuration)
        this._timers.push(doneId)
      }, Math.max(0, strokeMs + fillDelay))
      this._timers.push(id)
    })
  }

  /** Cancel current animation and clear the container. */
  destroy() {
    this._clear()
  }

  // ── private ────────────────────────────────────────────────────────────────

  _clear() {
    this._timers.forEach(clearTimeout)
    this._timers = []
    this.el.innerHTML = ''
  }

  async _getOpentype() {
    if (typeof opentype !== 'undefined') return opentype
    if (this._otReady) return this._otReady.then(() => window.opentype)
    this._otReady = _loadScript('https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js')
    await this._otReady
    return window.opentype
  }

  _buildLine(font, text, fontSize, sw, strokeCol, bgCol, svgNS) {
    const glyphs    = font.stringToGlyphs(text)
    const scale     = fontSize / font.unitsPerEm
    const ascender  = font.ascender  * scale
    const descender = font.descender * scale
    const lineH     = ascender - descender

    let totalWidth = 0
    glyphs.forEach((glyph, i) => {
      totalWidth += glyph.advanceWidth * scale
      if (i < glyphs.length - 1) totalWidth += font.getKerningValue(glyph, glyphs[i + 1]) * scale
    })

    // Return a <g> so play() can merge all lines into one SVG
    const g = document.createElementNS(svgNS, 'g')
    let x = 0
    const glyphPaths = []

    glyphs.forEach((glyph, i) => {
      if (!glyph.path || glyph.path.commands.length === 0) {
        x += glyph.advanceWidth * scale; return
      }
      const d = _commandsToD(_rotatePathToBottom(glyph.getPath(x, 0, fontSize).commands))
      if (!d) { x += glyph.advanceWidth * scale; return }

      const p = document.createElementNS(svgNS, 'path')
      p.setAttribute('d', d)
      p.setAttribute('stroke', strokeCol)
      p.setAttribute('stroke-width', sw * 2)
      p.setAttribute('stroke-linejoin', 'round')
      p.setAttribute('stroke-linecap',  'round')
      p.style.fill       = bgCol
      p.style.paintOrder = 'stroke fill'
      g.appendChild(p)
      glyphPaths.push(p)

      x += glyph.advanceWidth * scale
      if (i < glyphs.length - 1) x += font.getKerningValue(glyph, glyphs[i + 1]) * scale
    })

    return { g, glyphPaths, width: totalWidth, lineH, ascender }
  }

  _animateStrokes(paths, duration, lengths) {
    paths.forEach((p, i) => {
      p.style.willChange       = 'stroke-dashoffset'
      p.style.transition       = 'none'
      p.style.strokeDasharray  = lengths[i]
      p.style.strokeDashoffset = lengths[i]
    })
    // Force layout flush so the browser registers the initial dashoffset
    void document.body.offsetHeight
    paths.forEach(p => {
      p.style.transition       = `stroke-dashoffset ${duration}ms linear`
      p.style.strokeDashoffset = '0'
    })
  }
}
