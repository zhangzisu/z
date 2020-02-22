interface IContext {
  children: Promise<string>[]
}

interface IRendererCaller<T> {
  (r: Renderer<T>): Promise<string> | string | void
}

interface IHandler<T> {
  (r: Renderer<T>, content: string, options: any): Promise<string> | string
}

export class Renderer<T = {}> {
  context: IContext
  handlers: Map<keyof T, IHandler<T>>
  constructor () {
    this.context = {
      children: []
    }
    this.handlers = new Map()
  }

  sub () {
    const r = new Renderer<T>()
    // @ts-ignore
    for (const [k, v] of this.handlers) r.define(k, v)
    return r
  }

  define<C extends {}, S extends string> (tag: S, handler: IHandler<T & { [k in S]: C }>): Renderer<T & { [k in S]: C }> {
    // @ts-ignore
    this.handlers.set(tag, handler)
    // @ts-ignore
    return this
  }

  r<S extends keyof T> (tag: S, content?: string | IRendererCaller<T>, options?: T[S]) {
    if (typeof content === 'undefined') {
      const p = this.handlers.get(tag)!(this, '', options)
      this.context.children.push(Promise.resolve(p))
    } else if (typeof content === 'string') {
      const p = this.handlers.get(tag)!(this, content, options)
      this.context.children.push(Promise.resolve(p))
    } else {
      this.context.children.push((async () => {
        const sub = this.sub()
        const val = await content(sub) || await sub.getResult()
        return this.handlers.get(tag)!(this, val, options)
      })())
    }
    return this
  }

  async getResult () {
    const children = await Promise.all(this.context.children)
    return children.join('\n')
  }
}

function createHTMLHandler (tag: string) {
  return (_: any, c: string, o: any) => {
    const params: string[] = []
    for (const key in o) {
      params.push(`${key}="${o[key]}"`)
    }
    return `<${tag} ${params.join(' ')}>${c}</${tag}>`
  }
}

export const renderer = new Renderer()
  .define('a', createHTMLHandler('a'))
  .define('h1', createHTMLHandler('h1'))
  .define('h2', createHTMLHandler('h2'))
  .define('h3', createHTMLHandler('h3'))
  .define('h4', createHTMLHandler('h4'))
  .define('h5', createHTMLHandler('h5'))
  .define('h6', createHTMLHandler('h6'))
  .define('pre', createHTMLHandler('pre'))
  .define('code', createHTMLHandler('code'))
  .define('div', createHTMLHandler('div'))
