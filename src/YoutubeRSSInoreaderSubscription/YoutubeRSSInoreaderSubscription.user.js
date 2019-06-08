// ==UserScript==
// @name         Youtube-RSS-Inoreader-Subscription
// @namespace    http://github.com/rxliuli
// @version      1.0
// @description  为 Youtube 订阅者添加 RSS 订阅按钮，点击后弹出 Inoreader 的订阅窗口
// @author       rxliuli
// @match        https://www.youtube.com/*
// @license`     MIT
// ==/UserScript==
;(() => {
  /**
   * 安全执行某个函数
   * @param {Function} fn 需要执行的函数
   * @param {Object} [defaultVal] 发生异常后的默认返回值
   */
  function safeExec(fn, defaultVal = undefined) {
    try {
      return fn()
    } catch (err) {
      return defaultVal
    }
  }

  /**
   * 监视指定函数返回值的变化
   * @param {Function} fn 需要监视的函数
   * @param {Function} callback 回调函数
   * @param {Number} [interval] 每次检查的间隔时间，默认为 50ms
   */
  function watch(fn, callback, interval = 50) {
    var oldVal = safeExec(fn)
    setInterval(() => {
      var newVal = safeExec(fn)
      if (oldVal !== newVal) {
        callback(newVal, oldVal)
      }
      oldVal = newVal
    }, interval)
  }

  /**
   * 根据 html 字符串创建 Element 元素
   * @param {String} str html 字符串
   * @returns {Element} 创建的 Element 元素
   */
  function createElByString(str) {
    var root = document.createElement('div')
    root.innerHTML = str
    return root.querySelector('*')
  }

  /**
   * 解析 youtube 当前页面的 RSS 订阅按钮
   */
  async function parseRss() {
    var res = await fetch(location.href)
    var text = await res.text()
    return text.includes('rssUrl')
      ? text.split('"rssUrl":"')[1].split('"')[0]
      : `https://www.youtube.com/feeds/videos.xml?channel_id=${
          window.location.href.split('/channel/')[1].split('/')[0]
        }`
  }

  /**
   * 弹出订阅 RSS 的窗口
   * @param {String} url 需要订阅的 URL
   * @param {*} width 弹出窗口的宽度
   * @param {*} height 弹出窗口的高度
   */
  function inoreaderSubRss(url, width = 640, height = 400) {
    url =
      'https://www.inoreader.com/bookmarklet/subscribe/' +
      encodeURIComponent(url)
    var b = window.screenLeft || screen.left || 0
    var c = window.screenTop || screen.top || 0
    windowWidth = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width
    windowHeight = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height
    var left = windowWidth / 2 - width / 2 + b
    var top = windowHeight / 2 - height / 2 + c
    var newWindow = window.open(
      url,
      Date.now(),
      `width=${width}, height=${height}, top=${top}, left=${left}, location=yes,resizable=yes,status=no,scrollbars=no,personalbar=no,toolbar=no,menubar=no`,
    )
    if (window.focus && newWindow) {
      newWindow.focus()
    }
  }

  /**
   * 初始化订阅按钮
   */
  function initBtn() {
    var btn = createElByString(`
      <div
        href="javascript:void(0)"
        style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          box-shadow: 0 0 10px 0 rgb(204, 0, 0);
          text-align: center;
          line-height: 60px;
          font-size: 20px;
          position: fixed;
          z-index: 100;
          right: 50px;
          bottom: 50px;
          background-color: rgb(204, 0, 0);
          color: white;
          cursor: pointer;
        "
      >
        RSS
      </div>
    `)
    btn.addEventListener('click', async () => {
      inoreaderSubRss(await parseRss())
    })
    document.body.append(btn)
    return btn
  }

  function calcDisplay(btn) {
    return new RegExp('^https://www.youtube.com/channel/.*').test(location.href)
  }

  /**
   *
   * @param {Element} btn
   */
  function watchLocation(btn) {
    watch(
      () => location.href,
      newVal => {
        btn.style.display = calcDisplay(newVal) ? 'block' : 'none'
      },
    )
  }

  ;(() => {
    watchLocation(initBtn())
  })()
})()
