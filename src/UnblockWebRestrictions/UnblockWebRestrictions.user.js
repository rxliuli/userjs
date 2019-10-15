// ==UserScript==
// @name         解除网页限制
// @namespace    http://github.com/rxliuli
// @version      1.0
// @description  破解禁止复制/剪切/粘贴/选择/右键菜单的网站
// @author       rxliuli
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// 这里的 @run-at 非常重要，设置在文档开始时就载入脚本
// @run-at       document-start
// @require      https://greasyfork.org/scripts/382120-rx-util/code/rx-util.js
// ==/UserScript==

;(() => {
  const { safeExec } = rx
  /**
   * 兼容异步函数的返回值
   * @param res 返回值
   * @param callback 同步/异步结果的回调函数
   * @typeparam T 处理参数的类型，如果是 Promise 类型，则取出其泛型类型
   * @typeparam Param 处理参数具体的类型，如果是 Promise 类型，则指定为原类型
   * @typeparam R 返回值具体的类型，如果是 Promise 类型，则指定为 Promise 类型，否则为原类型
   * @returns 处理后的结果，如果是同步的，则返回结果是同步的，否则为异步的
   */
  function compatibleAsync(res, callback) {
    return res instanceof Promise ? res.then(callback) : callback(res)
  }
  /**
   * 在固定时间周期内只执行函数一次
   * @param {Function} fn 执行的函数
   * @param {Number} time 时间周期
   * @returns {Function} 包装后的函数
   */
  function onceOfCycle(fn, time) {
    const get = window.GM_getValue
    const set = window.GM_setValue
    const LastUpdateKey = 'LastUpdate'
    const LastValueKey = 'LastValue'
    return new Proxy(fn, {
      apply(_, _this, args) {
        const now = Date.now()
        const last = get(LastUpdateKey)
        if (last !== null && now - last < time) {
          return safeExec(() => JSON.parse(get(LastValueKey)))
        }
        return compatibleAsync(Reflect.apply(_, _this, args), res => {
          set(LastUpdateKey, now)
          set(LastValueKey, JSON.stringify(res))
          return res
        })
      },
    })
  }
  /**
   * 监听 event 的添加
   * 注：必须及早运行
   */
  function watchEventListener() {
    /**
     * 用来保存监听到的事件信息
     */
    class Event {
      constructor(el, type, listener, useCapture) {
        this.el = el
        this.type = type
        this.listener = listener
        this.useCapture = useCapture
      }
    }
    /**
     * 监听所有的 addEventListener, removeEventListener 事件
     */
    const documentAddEventListener = document.addEventListener
    const eventTargetAddEventListener = EventTarget.prototype.addEventListener
    const documentRemoveEventListener = document.removeEventListener
    const eventTargetRemoveEventListener =
      EventTarget.prototype.removeEventListener
    const events = []
    unsafeWindow.events = events
    /**
     * 自定义的添加事件监听函数
     * @param type 事件类型
     * @param listener 事件监听函数
     * @param [useCapture] 是否需要捕获事件冒泡，默认为 false
     */
    function addEventListener(type, listener, useCapture = false) {
      const $addEventListener =
        // @ts-ignore
        this === document
          ? documentAddEventListener
          : eventTargetAddEventListener
      // @ts-ignore
      events.push(new Event(this, type, listener, useCapture))
      // @ts-ignore
      $addEventListener.apply(this, arguments)
    }
    /**
     * 自定义的根据类型删除事件函数
     * 该方法会删除这个类型下面全部的监听函数，不管数量
     * @param type 事件类型
     */
    function removeEventListenerByType(type) {
      const $removeEventListener =
        // @ts-ignore
        this === document
          ? documentRemoveEventListener
          : eventTargetRemoveEventListener
      const removeIndexs = events
        // @ts-ignore
        .map((e, i) => (e.el === this || e.type === arguments[0] ? i : -1))
        .filter(i => i !== -1)
      removeIndexs.forEach(i => {
        const e = events[i]
        $removeEventListener.apply(e.el, [e.type, e.listener, e.useCapture])
      })
      removeIndexs.sort((a, b) => b - a).forEach(i => events.splice(i, 1))
    }
    document.addEventListener = EventTarget.prototype.addEventListener = addEventListener
    // @ts-ignore
    document.removeEventListenerByType = EventTarget.prototype.removeEventListenerByType = removeEventListenerByType
  }
  watchEventListener()

  // 注册菜单
  function registerMenu() {
    const domain = location.host
    const isIncludes = GM_getValue(domain) === true
    GM_registerMenuCommand(isIncludes ? '恢复默认' : '解除限制', () => {
      if (isIncludes) {
        GM_setValue(domain, false)
      } else {
        GM_setValue(domain, true)
      }
      location.reload()
    })
  }
  registerMenu()

  const eventTypes = [
    'copy',
    'cut',
    'select',
    'selectstart',
    'contextmenu',
    'dragstart',
  ]
  // 清除网页添加的事件
  function clearEvent() {
    document.querySelectorAll('*').forEach(el => {
      eventTypes.forEach(type => el.removeEventListenerByType(type))
    })
  }
  // 清理或还原DOM节点的onxxx属性
  function clearLoop() {
    let type
    let prop
    let c = [document, document.body, ...document.getElementsByTagName('div')]
    let e = document.querySelector('iframe[src="about:blank"]')
    if (e && e.clientWidth > 99 && e.clientHeight > 11) {
      e = e.contentWindow.document
      c.push(e, e.body)
    }

    for (e of c) {
      if (!e) continue
      e = e.wrappedJSObject || e
      for (type of eventTypes) {
        prop = 'on' + type
        e[prop] = null
      }
    }
  }
  // 清理掉网页添加的全局防止复制/选择的 CSS
  function clearCSS() {
    GM_addStyle(
      `html, * {
        -webkit-user-select:text !important;
        -moz-user-select:text !important;
        user-select:text !important;
      }
      ::-moz-selection {color:#111 !important; background:#05D3F9 !important;}
      ::selection {color:#111 !important; background:#05D3F9 !important;}`,
    )
  }
  // 更新支持的网站列表
  function updateHostList() {
    onceOfCycle(function() {
      GM_xmlhttpRequest({
        method: 'GET',
        url:
          'https://raw.githubusercontent.com/rxliuli/userjs/master/src/UnblockWebRestrictions/blockList.json',
        onload(res) {
          JSON.parse(res.responseText)
            .filter(domain => GM_getValue(domain) !== undefined)
            .forEach(domain => GM_setValue(domain, true))
        },
      })
    }, 1000 * 60 * 60 * 24)()
  }
  updateHostList()

  window.onload = function() {
    if (GM_getValue(location.host) === true) {
      clearEvent()
      clearLoop()
      clearCSS()
    }
  }
})()
