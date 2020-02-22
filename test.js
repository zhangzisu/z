import z from './index.js'

// Top-level define
z.define('custom', (z, content, options) => {
  return `<div>${content}</div>`
})

z.define('async', (z, content, options) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(`<async>${content}</async>`), 500)
  })
})

// SubInstance
const s = z.create()
s('this is pure text part')
s.h('custom', 'OoOoO')
  .h('p', 'chain calling is supported')
  .h('pre', 'no-defined tag will also rendered')
s.async('this is also ok')
s.h('div', s => {
  s.h('div', s => {
    s.h('div', s => s('禁止套娃'))
  })
})

s.x().then(console.log)
