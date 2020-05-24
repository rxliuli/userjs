// ==UserScript==
// @name         Slack 暗黑模式萌化（动态泡水灵梦）
// @namespace    http://github.com/rxliuli/userjs
// @version      0.1.0
// @description  try to take over the world!
// @author       rxliuli
// @match        https://app.slack.com/client/*
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==
;
(function () {
    'use strict';
    /**
     * 根据 html 字符串创建 Element 元素
     * @param str html 字符串
     * @returns 创建的 Element 元素
     */
    function createElByString(str) {
        const root = document.createElement('div');
        root.innerHTML = str;
        return root.querySelector('*');
    }
    const $videoEl = createElByString(`<video
  id="videoWallPaper"
  muted="muted"
  loop="loop"
  autoplay="autoplay"
  src="https://iirose.github.io/file/assets/reimu"
></video>
`);
    // language=CSS
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
/*需要透明化的元素*/
body,
.p-client_container,
.p-client,
.p-client .p-top_nav,
.p-workspace {
  background-color: transparent;
}
.p-workspace {
  /*background-image: url(https://cdn.jsdelivr.net/gh/rxliuli/img-bed/20200306083232.jpg);*/
  /*background-repeat: no-repeat;*/
  /*background-size: cover;*/
}

/* 工作区 */
.p-workspace * {
  background-color: rgba(48, 48, 48, 0.08) !important;
}
/* 鼠标在消息上 */
.c-message_kit__message:hover {
  background-color: rgba(48, 48, 48, 0.5) !important;
}
/* 消除文本特殊加重 */
.c-message_kit__blocks--rich_text * {
  background-color: transparent !important;
}
.c-message_list__day_divider__line {
  border-color: rgba(48, 48, 48, 0.5) !important;
}
`);
    document.body.appendChild($videoEl);
})();
