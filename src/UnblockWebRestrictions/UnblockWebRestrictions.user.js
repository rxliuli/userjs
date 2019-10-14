// ==UserScript==
// @name         解除网页限制
// @namespace    http://github.com/rxliuli
// @version      1.0
// @description  破解禁止复制/剪切/粘贴/选择/右键菜单的网站
// @author       rxliuli
// @include      *
// @grant        GM.getValue
// @grant        GM.setValue
// 这里的 @run-at 非常重要，设置在文档开始时就载入脚本
// @run-at       document-start
// ==/UserScript==

;(() => {
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

  // 清除网页添加的事件
  function clearEvent() {
    const eventTypes = [
      'copy',
      'cut',
      'select',
      'contextmenu',
      'selectstart',
      'dragstart',
    ]
    document.querySelectorAll('*').forEach(el => {
      eventTypes.forEach(type => el.removeEventListenerByType(type))
    })
  }

  window.onload = function() {
    const domainList = GM_listValues()
    const domain = location.host
    const isIncludes = domainList.includes(domain)
    if (isIncludes) {
      clearEvent()
    }
    GM_registerMenuCommand(isIncludes ? '恢复默认' : '解除限制', () => {
      if (isIncludes) {
        GM_deleteValue(domain)
      }else{
        GM_setValue()
      }
    })
  }
})()
