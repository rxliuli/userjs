// ==UserScript==
// @name         动漫花园广告屏蔽
// @namespace    http://github.com/rxliuli/userjs
// @version      0.1
// @description  屏蔽动漫花园的广告，弥补动漫花园针对广告拦截器的专用漏洞。已废弃，请
// @author       rxliuli
// @match        https://dmhy.org/
// @match        https://share.dmhy.org/
// @grant        MIT
// @deprecated 已废弃，请直接使用 {@link ./dmhyHover.user.css} 即可。
// ==/UserScript==

;(function() {
  'use strict'
  ;[
    document.querySelector('#\\31 280_adv'),
    document.querySelector('.ad'),
    document.querySelector('#\\31 280_ad > a'),
  ].forEach(ad => ad.remove())
})()
