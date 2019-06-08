// ==UserScript==
// @name         91Flac Download
// @namespace    https://github.com/rxliuli
// @version      0.1
// @description  在 91Flac 下载歌曲自动设置文件名
// @author       rxliuli
// @match        https://91flac.vip/*
// @license      MIT
// @require      https://greasyfork.org/scripts/382120-rx-util/code/rx-util.js?version=705860
// @grant        GM_xmlhttpRequest
// ==/UserScript==

;(function() {
  'use strict'
  /**
   * 获取到所有需要替换的按钮
   * 获取歌曲名
   * 获取后缀名
   * 添加按钮点击事件，修改按钮的超链接
   */
  const MusicSuffixSet = new Set(['flac', 'ape', 'm4a', 'ogg', 'mp3'])
  const EmptyHref = 'javascript:void(0)'

  /**
   * 简单的弹窗组件
   */
  const Loading = rx.singleModel(
    class Loading {
      constructor() {
        const LoadingText = `
    <div class="rx-loading" style="position: fixed; right: 10px; bottom: 10px;">
      <div
        class="loading-content"
        style="background-color: grey; color: white; font-size: 20px; padding: 10px;"
      >
        正在下载...（<span class="loading-progress">50</span>%）
      </div>
    </div>
    `
        document.body.append(rx.createElByString(LoadingText))
        this.hide()
      }
      show() {
        document.querySelector('.rx-loading').style.display = 'block'
      }
      hide() {
        document.querySelector('.rx-loading').style.display = 'none'
      }
      progress(num) {
        document.querySelector('.rx-loading .loading-progress').innerHTML = num
      }
    },
  )
  function load() {
    const loading = new Loading()
    loading.show()
    loading.progress(0)
    return loading
  }

  /**
   * 下载歌曲
   * @param {string} url 链接
   * @param {string} name 歌曲全名，包括后缀
   */
  function downloadMusic(url, name) {
    const loading = load()
    GM_xmlhttpRequest({
      method: 'GET',
      responseType: 'blob',
      url,
      onload(res) {
        rx.download(res.response, name)
        loading.hide()
      },
      onprogress(res) {
        if (res.readyState !== 3) {
          return
        }
        const num = parseInt((res.done * 100) / res.total)
        loading.progress(num)
      },
    })
  }

  /**
   * 获取所有可用的下载按钮列表
   */
  function getBtnList() {
    function predicate($elem) {
      if (!MusicSuffixSet.has($elem.dataset.suffix)) {
        return false
      }
      const $btn = $elem.querySelector('a.btn')
      if (
        $btn === null ||
        $btn.classList.contains('disabled') ||
        $btn.href === EmptyHref
      ) {
        return false
      }
      return true
    }
    return Array.from(document.querySelectorAll('.download'))
      .filter(predicate)
      .map($elem => ({
        el: $elem.querySelector('a.btn'),
        suffix: $elem.dataset.suffix,
      }))
  }

  /**
   * 获取当前页面的歌曲名
   */
  function getMusicName() {
    return document.querySelector('.rounded .h3').innerHTML
  }

  /**
   * 添加事件
   * @param {object} option 选项
   * @param {Element} option.el 按钮元素
   * @param {string} option.suffix 后缀名
   */
  function addClickEvent({ el, suffix }) {
    const url = el.href
    el.addEventListener('click', function() {
      downloadMusic(url, `${getMusicName()}.${suffix}`)
    })
    el.href = EmptyHref
  }

  ;(async () => {
    // 等待全部按钮都加载完毕
    await rx.wait(() =>
      Array.from(document.querySelectorAll('.download a.btn')).every(
        $el => $el.innerText !== '加载中...',
      ),
    )
    getBtnList().forEach(addClickEvent)
  })()
})()
