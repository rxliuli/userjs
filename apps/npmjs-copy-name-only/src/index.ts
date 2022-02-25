/**
 * @link https://juejin.cn/post/6844903749421367303
 * @param type
 */
function _wr(type: keyof History) {
  const orig = history[type]
  return function (this: History) {
    const rv = orig.apply(this, arguments)
    const e = new Event(type) as any
    e.arguments = arguments
    window.dispatchEvent(e)
    return rv
  }
}

history.pushState = _wr('pushState')
history.replaceState = _wr('replaceState')

function updateCopyCmd() {
  const pkgName = location.pathname.slice('/package/'.length)
  const $el = document.querySelector(
    'code.db[title="Copy Command to Clipboard"] span',
  ) as HTMLSpanElement
  $el.innerHTML = pkgName
}

window.addEventListener('load', updateCopyCmd)
window.addEventListener('popstate', updateCopyCmd)
window.addEventListener('pushState', updateCopyCmd)
window.addEventListener('replaceState', updateCopyCmd)
