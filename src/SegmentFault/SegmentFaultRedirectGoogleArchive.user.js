// ==UserScript==
// @name         SegmentFault Google 搜索自动跳转到存档
// @namespace    http://github.com/rxliuli/userjs
// @version      0.1
// @description  SF 最近两天因为一些不可说的原因被暂停停了，所以写个脚本让 Google 搜索中所有 SF 的链接都跳转到 Google 的纯文字存档中。
// @author       rxliuli
// @match        https://www.google.com/search?q=*
// ==/UserScript==

;(function() {
  'use strict'
  const sfList = Array.from(document.querySelectorAll('#search .g')).filter(
    dom => dom.getAttribute('ghhhost') === 'segmentfault.com',
  )
  sfList.forEach(dom => {
    dom.querySelector('.rc .r > a:first-child').href =
      dom.querySelector('.fl').href + '&strip=1&vwsrc=0'
  })
})()
