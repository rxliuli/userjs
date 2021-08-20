// ==UserScript==
// @name        npmjs-copy-name-only
// @description npm.js 仅复制名字
// @namespace   https://github.com/rxliuli/userjs
// @version     0.1.0
// @author      rxliuli
// @match       https://www.npmjs.com/package/*
// @icon        https://www.google.com/s2/favicons?domain=npmjs.com
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  /**
   * @link https://juejin.cn/post/6844903749421367303
   * @param type
   */
  function _wr(type) {
    const orig = history[type];
    return function () {
      const rv = orig.apply(this, arguments);
      const e = new Event(type); 
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv
    }
  }

  history.pushState = _wr('pushState');
  history.replaceState = _wr('replaceState');

  function updateCopyCmd() {
    const pkgName = location.pathname.slice('/package/'.length);
    const $el = document.querySelector(
      'code.db[title="Copy Command to Clipboard"] span',
    ); 
    $el.innerHTML = pkgName;
  }

  window.addEventListener('load', updateCopyCmd);
  window.addEventListener('popstate', updateCopyCmd);
  window.addEventListener('pushState', updateCopyCmd);
  window.addEventListener('replaceState', updateCopyCmd);

}());
