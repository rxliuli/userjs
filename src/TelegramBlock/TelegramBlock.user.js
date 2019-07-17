// ==UserScript==
// @name         Telegram 屏蔽群用户消息
// @namespace    http://rxliuli.com/
// @version      0.1
// @description  全局隐藏指定用户的消息
// @author       rxliuli
// @include      https://web.telegram.org/*
// @grant        unsafeWindow
// @linsence     MIT
// ==/UserScript==

;(function () {
  'use strict'
  // 屏蔽用户名列表
  const blockUsernameList = ['Septs']

  setInterval(function () {
    Array.from(
      unsafeWindow.document.querySelectorAll('.im_history_message_wrap')
    )
      .filter(item => {
        const inner = item.querySelector('.im_message_author')
        if (!inner) {
          return false
        }
        const username = inner.innerText
        return blockUsernameList.includes(username)
      })
      .forEach(item => (item.hidden = true))
  }, 1000)
})()
