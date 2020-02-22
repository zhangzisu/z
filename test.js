import r from './index.js'

const i = r.sub().define('custom', (r, c, o) => 'custom')

i.r('custom')
i.custom()
i('123')
i('456')
i.g()
  .then(console.log)
