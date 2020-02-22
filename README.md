# Z
This is a low-level package for generating HTML pages using Javascript

### Example
```js
import z from '@zhangzisu/z'

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
```
```
output:
this is pure text part
<div>OoOoO</div>
<p >chain calling is supported</p>
<pre >no-defined tag will also rendered</pre>
<async>this is also ok</async>
<div ><div ><div >禁止套娃</div></div></div>
```

See also: https://github.com/ZhangZisu/zlog-fe/blob/a7ade30dc02f502eba1013b88e3135b863213a61/src/plugins/z.js
