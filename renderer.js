import { escapeHtml, createHTMLHandler } from './util.js'

class ExtensibleFunction extends Function {
  constructor (f) {
    return Object.setPrototypeOf(f, new.target.prototype)
  }
}

class Renderer extends ExtensibleFunction {
  constructor () {
    // https://stackoverflow.com/a/36871498
    super((...args) => this.__call__(...args))

    this._context = {
      children: []
    }
    this._handlers = new Map()
  }

  __call__ (content) {
    if (content) {
      this._context.children.push(escapeHtml(content))
    } else {
      this._context.children.push('<br/>')
    }
    return this
  }

  create () {
    const r = new Renderer()
    for (const [k, v] of this._handlers) r.define(k, v)
    return r
  }

  define (tag, handler) {
    this._handlers.set(tag, handler)
    this[tag] = (content, options) => this.h(tag, content, options)
    return this
  }

  h (tag, content, options) {
    const h = this._handlers.get(tag) || createHTMLHandler(tag)
    if (typeof content === 'undefined') {
      const p = h(this, '', options)
      this._context.children.push(Promise.resolve(p))
    } else if (typeof content === 'string') {
      const p = h(this, content, options)
      this._context.children.push(Promise.resolve(p))
    } else {
      this._context.children.push((async () => {
        const sub = this.create()
        const c = await content(sub)
        const val = typeof c === 'string' ? c : await sub.x()
        return h(this, val, options)
      })())
    }
    return this
  }

  async x () {
    const children = await Promise.all(this._context.children)
    return children.join('\n')
  }
}

export default new Renderer()
