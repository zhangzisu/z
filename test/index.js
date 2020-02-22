const rnd = require('..').default

rnd
  .define('z', (r, c, o) => 'z')
  .r('z')
  .r('a')
  .g()
  .then(console.log)