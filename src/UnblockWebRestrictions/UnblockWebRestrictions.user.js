// ==UserScript==
// @name         解除网页限制
// @namespace    http://github.com/rxliuli
// @version      1.2
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
// ==/UserScript==

;(() => {
  /**
   * 安全执行某个函数
   * 支持异步函数
   * @param fn 需要执行的函数
   * @param defaultVal 发生异常后的默认返回值，默认为 null
   * @param args 可选的函数参数
   * @returns 函数执行的结果，或者其默认值
   */
  function safeExec(fn, defaultVal, ...args) {
    const defRes = defaultVal === undefined ? null : defaultVal
    try {
      const res = fn(...args)
      return res instanceof Promise ? res.catch(() => defRes) : res
    } catch (err) {
      return defRes
    }
  }

  const isBlock = GM_listValues().some(
    host => location.host.includes(host) && GM_getValue(host) === true,
  )
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

  // 注册菜单
  function registerMenu() {
    const domain = location.host
    const isIncludes = GM_getValue(domain) === true
    GM_registerMenuCommand(isBlock ? '恢复默认' : '解除限制', () => {
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
    'paste',
    'select',
    'selectstart',
    'contextmenu',
    'dragstart',
  ]

  /**
   * 监听 event 的添加
   * 注：必须及早运行
   */
  function watchEventListener() {
    /**
     * 监听所有的 addEventListener, removeEventListener 事件
     */
    const documentAddEventListener = document.addEventListener
    const eventTargetAddEventListener = EventTarget.prototype.addEventListener
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

      // 在这里阻止会更合适一点
      if (eventTypes.includes(type)) {
        console.log('拦截 addEventListener: ', type, this)
        return
      }
      // @ts-ignore
      $addEventListener.apply(this, arguments)
    }
    document.addEventListener = EventTarget.prototype.addEventListener = addEventListener
  }
  // 清理使用 onXXX 添加到事件
  function clearJsOnXXXEvent() {
    const emptyFunc = () => {}
    function modifyPrototype(prototype, type) {
      Object.defineProperty(prototype, `on${type}`, {
        get() {
          return emptyFunc
        },
        set() {
          return true
        },
      })
    }
    eventTypes.forEach(type => {
      modifyPrototype(HTMLElement.prototype, type)
      modifyPrototype(document, type)
    })
  }

  if (isBlock) {
    watchEventListener()
    clearJsOnXXXEvent()
  }
  // 清理或还原DOM节点的onXXX 属性
  function clearDomOnXXXEvent() {
    function _innerClear() {
      eventTypes.forEach(type => {
        document
          .querySelectorAll(`[on${type}]`)
          .forEach(el => el.setAttribute(`on${type}`, 'return true'))
      })
    }
    setInterval(_innerClear, 3000)
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
            .filter(domain => GM_getValue(domain) === undefined)
            .forEach(domain => {
              console.log('更新了屏蔽域名: ', domain)
              GM_setValue(domain, true)
            })
        },
      })
    }, 1000 * 60 * 60 * 24)()
  }
  updateHostList()

  window.addEventListener('load', function() {
    if (isBlock) {
      clearDomOnXXXEvent()
      clearCSS()
    }
  })
})()
