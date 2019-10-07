// ==UserScript==
// @name         MDN 自动跳转中文翻译
// @namespace    http://github.com/rxliuli/
// @version      1.0.1
// @description  如果有中文翻译的话就跳转到中文翻译页面, 该脚本是为了弥补 MDN 自动切换有时候会抽风的问题
// @author       rxliuli
// @match        http*://developer.mozilla.org/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// ==/UserScript==

;(function() {
  'use strict'

  /**
   * MDN 自动跳转中文翻译
   * 如果来到一个 MDN 的网页
   * 判断当前页面是否为中文
   *    - 如果是，就不进行任何操作
   *    - 否则判断当前页面是否有中文翻译页面
   *      - 如果没有，则不进行任何操作
   *      - 否则跳转至中文翻译页面
   */
  ;(() => {
    // 默认语言
    const DefaultLanguage = 'zh-CN'

    /**
     * 切换语言为中文
     */
    function toggleZhCN() {
      // 判断是否存在
      const url = new RegExp('/.*?/(.*)').exec(location.pathname)[1]
      const exists = GM_getValue(url)
      if (exists === true) {
        return
      }
      // 获取 language
      const language = new RegExp('/(.*?)/').exec(location.pathname)[1]

      // 判断 language 是否为中文
      if (language === DefaultLanguage) {
        return
      }

      // 获取可能存在的中文翻译页面
      const zhCN = document.querySelector('#translations li[lang="zh-CN"] a')
      // 如果有就跳转过去
      if (zhCN) {
        zhCN.click()
      }
    }
    /**
     * 显示启用/禁用切换语言菜单
     */
    function registerMenu() {
      const url = new RegExp('/.*?/(.*)').exec(location.pathname)[1]
      const exists = GM_getValue(url)
      const language = new RegExp('/(.*?)/').exec(location.pathname)[1]
      if (exists === true) {
        GM_registerMenuCommand('启用自动切换中文', function() {
          GM_deleteValue(url)
          location.replace(location.href.replace(language, DefaultLanguage))
        })
      } else {
        // 显示切换菜单
        GM_registerMenuCommand('禁用自动切换中文', function() {
          // 添加到禁用 URL 列表
          GM_setValue(url, true)
          location.replace(location.href.replace(language, 'en-US'))
        })
      }
    }

    registerMenu()
    toggleZhCN()
  })()
})()
