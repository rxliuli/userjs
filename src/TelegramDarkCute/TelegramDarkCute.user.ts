// ==UserScript==
// @name         Telegram 暗黑模式萌化（动态泡水灵梦）
// @namespace    http://github.com/rxliuli/userjs
// @version      0.1.0
// @description  try to take over the world!
// @author       rxliuli
// @match        https://evgeny-nadymov.github.io/*
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

;(function() {
  'use strict'

  /**
   * 根据 html 字符串创建 Element 元素
   * @param str html 字符串
   * @returns 创建的 Element 元素
   */
  function createElByString(str: string): HTMLElement {
    const root = document.createElement('div')
    root.innerHTML = str
    return root.querySelector('*') as HTMLElement
  }

  const $videoEl = createElByString(`<video
  id="videoWallPaper"
  muted="muted"
  loop="loop"
  autoplay="autoplay"
  src="https://iirose.github.io/file/assets/reimu"
></video>
`)
  GM_addStyle(`video#videoWallPaper {
  position: fixed;
  right: 0;
  bottom: 0;

  min-width: 100%;
  min-height: 100%;

  width: auto;
  height: auto;
  z-index: -100;

  background-image: url(https://cdn.jsdelivr.net/gh/rxliuli/img-bed/20200306083232.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}

/*需要透明化的背景*/
body,
.page {
  background-color: transparent;
}

/* 详情的背景 */
.page {
  /*
    background-image: url(https://cdn.jsdelivr.net/gh/rxliuli/img-bed/20200306083232.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    */
}
.dialog-details {
  background-color: transparent;
}

/* 让页面占宽 100% */
.page {
  max-width: 100%;
}
/* 消息背景 */
.message-content,
/* 主输入框 */
.inputbox-bubble,
/* 固定消息 */
.pinned-message {
  background-color: rgba(48, 48, 48, 0.8);
}
/* 选择的联系人 */
.dialog-active {
  background-color: rgba(80, 162, 233, 0.6);
}
/* 联系人 */
.sidebar-page,
.dialogs,
.dialogs-list,
/* 未读消息提示条 */
.unread-separator,
/* 顶部标题栏透明化 */
.header-details,
/* 群组消息 */
.chat-info {
  background-color: rgba(0, 0, 0, 0.2);
}
/* 归档的联系人列表 */
.dialogs-list:nth-of-type(2) {
  background-color: rgba(48, 48, 48, 0.95);
}
.MuiPaper-root {
  background-color: rgba(0, 0, 0, 0.95);
}

/* 代码片段，此处用于提高对比度 */
code {
  color: #e96900;
}
`)
  document.body.appendChild($videoEl)
})()
