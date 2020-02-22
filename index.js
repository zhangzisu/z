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

    this.__call__ = this.__call__.bind(this)
    return this
  }

  __call__ (content) {
    this._context.children.push(content)
    return this
  }

  sub () {
    const r = new Renderer()
    for (const [k, v] of this._handlers) r.define(k, v)
    return r
  }

  define (tag, handler) {
    this._handlers.set(tag, handler)
    this[tag] = (content, options) => this.r(tag, content, options)
    return this
  }

  r (tag, content, options) {
    const h = this._handlers.get(tag) || createHTMLHandler(tag)
    if (typeof content === 'undefined') {
      const p = h(this, '', options)
      this._context.children.push(Promise.resolve(p))
    } else if (typeof content === 'string') {
      const p = h(this, content, options)
      this._context.children.push(Promise.resolve(p))
    } else {
      this._context.children.push((async () => {
        const sub = this.sub()
        const val = await content(sub) || await sub.g()
        return h(this, val, options)
      })())
    }
    return this
  }

  async g () {
    const children = await Promise.all(this._context.children)
    return children.join('\n')
  }
}

function createHTMLHandler (tag) {
  return (_, c, o) => {
    const params = []
    for (const key in o) {
      params.push(`${key}="${o[key]}"`)
    }
    return `<${tag} ${params.join(' ')}>${c}</${tag}>`
  }
}

export default new Renderer()
