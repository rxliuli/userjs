// ==UserScript==
// @name        telegram-group-user-shield
// @description 在 telegram 群组中屏蔽置顶用户的消息
// @namespace   http://github.com/rxliuli/userjs
// @version     0.2.7
// @author      rxliuli
// @match       https://evgeny-nadymov.github.io/telegram-react/*
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

  function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
   * 新增的消息处理器
   */
  class AddMsgProcessor {constructor() { AddMsgProcessor.prototype.__init.call(this);AddMsgProcessor.prototype.__init2.call(this); }
     __init() {this.tempMsgList = [];}
     __init2() {this.flag = false;}

    process(item) {
      const userName = _optionalChain([item, 'access', _ => _.querySelector, 'call', _2 => _2('.tile-text'), 'optionalAccess', _3 => _3.innerHTML]);
      if (userName === '大逗') {
        this.flag = true;
        this.tempMsgList.push(item);
        return
      }
      if (!userName && this.flag) {
        this.tempMsgList.push(item);
        return
      }
    }

     hide() {
      this.tempMsgList.forEach((item) => {
        console.log(
          '隐藏的消息: ',
          item.querySelector('.message-text').textContent,
        );
        item.style.display = 'none';
      });
    }
  }

  const addMsgProcessor = new AddMsgProcessor();

  /**
   * 添加对消息列表的监听
   */
  function addMsgListWatch() {
    const $msgList = document.querySelector('.messages-list-items');
    new MutationObserver((mutations, observer) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
  ([...mutation.addedNodes] ).forEach((item) =>
            addMsgProcessor.process(item),
          );
        }
      }
    }).observe($msgList, {
      childList: true,
    });
  }

  addMsgListWatch();

}());
