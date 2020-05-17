// ==UserScript==
// @name         国开网课自动刷
// @namespace    http://github.com/rxliuli/userjs
// @version      0.1.0
// @description  try to take over the world!
// @author       rxliuli
// @match        http://guangzhou.ouchn.cn/course/view.php?id=*
// @grant        none
// @license      MIT
// ==/UserScript==

;(function() {
  'use strict'

  /**
   * 等待指定的时间/等待指定表达式成立
   * 如果未指定等待条件则立刻执行
   * 注: 此实现在 nodejs 10- 会存在宏任务与微任务的问题，切记 async-await 本质上还是 Promise 的语法糖，实际上并非真正的同步函数！！！即便在浏览器，也不要依赖于这种特性。
   * @param param 等待时间/等待条件
   * @returns Promise 对象
   */
  function wait(param?: number | (() => boolean)): Promise<void> {
    return new Promise(resolve => {
      if (typeof param === 'number') {
        setTimeout(resolve, param)
      } else if (typeof param === 'function') {
        const timer = setInterval(() => {
          if (param()) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      } else {
        resolve()
      }
    })
  }

  /**
   * 获取所有的视频链接
   */
  function listVideoHrefList() {
    const $videoSectionList = Array.from(
      document.querySelectorAll('.content'),
    ).filter(
      el =>
        el.innerHTML.includes(
          'http://guangzhou.ouchn.cn/theme/blueonionre/pix/he.png',
        ) &&
        !el.className.includes('act') &&
        !el.querySelector('.flexsections'),
    )
    const watchedList: string[] = JSON.parse(
      localStorage.getItem('watchedList') || '[]',
    )
    const videoLinkList = $videoSectionList
      .flatMap(
        el =>
          (el.querySelectorAll(
            '.activityinstance > a',
          ) as any) as HTMLLinkElement,
      )
      .filter($a => watchedList.includes($a.href))
      .map($a => $a.href)
    return videoLinkList
  }

  async function forTriggerVideoLink(hrefList: string[]) {
    for (let url of hrefList) {
      window.open(url, '_blank')
      localStorage.setItem('status', 'started')
      await wait()
    }
  }

  window.addEventListener('load', () => {
    const hrefList = listVideoHrefList()
    forTriggerVideoLink(hrefList)
  })
})()
