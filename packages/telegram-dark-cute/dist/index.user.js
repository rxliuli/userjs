// ==UserScript==
// @name        Telegram 暗黑模式萌化
// @description Telegram 暗黑模式萌化，理论上支持任何视频背景。
// @namespace   http://github.com/rxliuli/userjs
// @version     0.2.6
// @author      rxliuli
// @match       https://evgeny-nadymov.github.io/*
// @match       http://127.0.0.1:*/*
// @match       http://localhost:*/*
// @match       https://userjs.rxliuli.com/*
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  function setBackVideo(config) {
    /**
     * 根据 html 字符串创建 Element 元素
     * @param str html 字符串
     * @returns 创建的 Element 元素
     */
    function createElByString(str) {
      const root = document.createElement('div');
      root.innerHTML = str;
      return root.querySelector('*') 
    }

    const $videoEl = createElByString(`<video
  id="videoWallPaper"
  muted="muted"
  loop="loop"
  autoplay="autoplay"
  src="${config.videoUrl}"
/>
`);
    GM_addStyle(`video#videoWallPaper {
  position: fixed;
  right: 0;
  bottom: 0;

  min-width: 100%;
  min-height: 100%;

  width: auto;
  height: auto;
  z-index: -100;

  background-image: url(${config.imageUrl || ''});
  background-repeat: no-repeat;
  background-size: cover;
  filter: brightness(0.5);
}
`);
    document.body.appendChild($videoEl);
  }

  function addOtherStyle() {
    GM_addStyle(`
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
.dialog-details,
.dialog-background {
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
.dialogs .dialogs-list:nth-of-type(2),
.dialogs-list,
/* 未读消息提示条 */
.unread-separator,
/* 顶部标题栏透明化 */
.header-details,
/* 群组消息 */
.chat-info {
  background-color: rgba(0, 0, 0, 0.2);
}
.dialogs .sidebar-page:nth-child(2) {
  background: var(--panel-background);
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
    `);
  }

  class ConfigApi {
    async list() {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'https://userjs.rxliuli.com/data.json',
          onload(res) {
            resolve(JSON.parse(res.responseText));
            console.log('ConfigApi.list success: ', JSON.parse(res.responseText));
          },
          onerror(e) {
            reject(e);
            console.log('ConfigApi.list error: ', e);
          },
        });
      })
    }

     static  __initStatic() {this.CurrentBackgroundVideoKey = 'CurrentBackgroundVideo';}

    get() {
      try {
        const config = JSON.parse(
          GM_getValue(ConfigApi.CurrentBackgroundVideoKey),
        );
        console.error('ConfigApi.get success: ', config);
        return config
      } catch (e) {
        console.error('ConfigApi.get error: ', e);
      }
    }
    set(config) {
      return GM_setValue(
        ConfigApi.CurrentBackgroundVideoKey,
        JSON.stringify(config),
      )
    }
  } ConfigApi.__initStatic();
  const configApi = new ConfigApi();

  if (window.location.hostname === 'evgeny-nadymov.github.io') {
    const config = configApi.get();
    if (config) {
      setBackVideo(config);
      addOtherStyle();
    }
  }

  if (
    location.href.startsWith('https://userjs.rxliuli.com/') ||
    location.hostname === '127.0.0.1'
  ) {
    Reflect.set(unsafeWindow, 'com.rxliuli.TelegramDarkCute.configApi', configApi);
  }

}());
