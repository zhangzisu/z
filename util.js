const voids = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'.split(',')

export function createHTMLHandler (tag) {
  if (voids.includes(tag)) return voidHTML(tag)
  return commonHTML(tag)
}

export function commonHTML (tag) {
  return (_, c, o) => {
    const params = []
    for (const key in o) {
      params.push(`${key}="${o[key]}"`)
    }
    return `<${tag} ${params.join(' ')}>${escapeHtml(c)}</${tag}>`
  }
}

export function voidHTML (tag) {
  return (_, c, o) => {
    const params = []
    for (const key in o) {
      params.push(`${key}="${o[key]}"`)
    }
    return `<${tag} ${params.join(' ')}>`
  }
}

export function escapeHtml (unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
