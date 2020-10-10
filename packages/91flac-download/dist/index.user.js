// ==UserScript==
// @name        91Flac Download
// @description 在 91Flac 下载歌曲自动设置文件名
// @namespace   https://github.com/rxliuli
// @version     0.1.3
// @author      rxliuli
// @match       http*://www.91flac.com/*
// @match       http*://91flac.vip/*
// @match       http*://*.91flac.vip/*
// @license     MIT
// @require     https://greasyfork.org/scripts/382120-rx-util/code/rx-util.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function (rxUtil) {
  'use strict';

  /**
   * 简单的弹窗组件
   */
  // eslint-disable-next-line no-undef
  const Loading = rxUtil.singleModel(
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
    `;
        // eslint-disable-next-line no-undef
        document.body.append(rx.createElByString(LoadingText));
        this.hide();
      }
      show() {
        document.querySelector('.rx-loading').style.display = 'block';
      }
      hide() {
        document.querySelector('.rx-loading').style.display = 'none';
      }
      progress(num) {
        document.querySelector('.rx-loading .loading-progress').innerHTML = num;
      }
    },
  );
  function load() {
    const loading = new Loading();
    loading.show();
    loading.progress(0);
    return loading
  }

  /**
   * 下载歌曲
   * @param {string} url 链接
   * @param {string} name 歌曲全名，包括后缀
   */
  function downloadMusic(url, name) {
    const loading = load();
    // eslint-disable-next-line no-undef
    GM_xmlhttpRequest({
      method: 'GET',
      responseType: 'blob',
      url,
      onload(res) {
        // eslint-disable-next-line no-undef
        rx.download(res.response, name);
        loading.hide();
      },
      onprogress(res) {
        if (res.readyState !== 3) {
          return
        }
        const num = parseInt((res.done * 100) / res.total);
        loading.progress(num);
      },
    });
  }
  /**
   * 下载单个歌曲
   */
  function singleDownload() {
    /**
     * 获取到所有需要替换的按钮
     * 获取歌曲名
     * 获取后缀名
     * 添加按钮点击事件，修改按钮的超链接
     */
    const MusicTypeList = ['flac', 'ape', 'mp3', 'aac', 'ogg', 'm4a'];
    const EmptyHref = 'javascript:void(0)';

    /**
     * 获取所有可用的下载按钮列表
     */
    function getBtnList() {
      function predicate($elem) {
        if (!MusicTypeList.some((type) => $elem.dataset.type.includes(type))) {
          return false
        }
        const $btn = $elem.querySelector('a.btn');
        return !(
          $btn === null ||
          $btn.classList.contains('disabled') ||
          $btn.href === EmptyHref
        )
      }
      return Array.from(document.querySelectorAll('.download'))
        .filter(predicate)
        .map(($elem) => ({
          el: $elem.querySelector('a.btn'),
          suffix: $elem.dataset.type,
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
      const url = el.href;
      el.addEventListener('click', function () {
        downloadMusic(url, `${getMusicName()}.${suffix}`);
      });
      el.href = EmptyHref;
      el.removeAttribute('target');
    }
  (async () => {
      // 等待全部按钮都加载完毕
      // eslint-disable-next-line no-undef
      await rx.wait(() =>
        Array.from(document.querySelectorAll('.download a.btn')).every(
          ($el) => $el.innerText !== '加载中...',
        ),
      );
      getBtnList().forEach(addClickEvent);
    })();
  }

  /**
   * 批量下载
   */
  function batchDownload() {
    /**
     * 获取选中的 id 列表
     * 请求后台得到详细的链接
     * 询问下载选项（类型/优先音质）
     * 下载歌曲
     */
    function getSelectedTrList() {
      return Array.from(document.querySelectorAll('.songs-list tbody tr')).filter(
        ($el) => $el.querySelector('td input[type="checkbox"]').checked,
      )
    }
    function getSelectedIdList(trList) {
      return trList.map(
        ($el) => $el.querySelector('td input[type="checkbox"]').value,
      )
    }
    async function getLinks(idList) {
      fetch('https://www.91flac.com/song/links', {
        credentials: 'omit',
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json;charset=UTF-8',
          'x-csrf-token': 'hRsUiNhoByVzlbUxYdaJRQtaoEQReU5Q7vASPWwq',
          'x-requested-with': 'XMLHttpRequest',
          'x-xsrf-token':
            'eyJpdiI6IkpDTE53eHBCc29GSjJEWjFIcHB3blE9PSIsInZhbHVlIjoibVZPaVlcLzNVVDBXYnljNllkVGE5allZMzIyUFk1bWs5M29oTElxeG1NXC9BNDk1YXQxK20yOFN4MHVFN0hTMnBvIiwibWFjIjoiNDk2MDFjOWU2ODI1NTQ0ZTcwMzg2OTBjMGUwM2JhYmQwM2NiMWVhNjBmODNkYTE2YzRhNTY1ZWM0YjNkNzhjMiJ9',
        },
        referrer:
          'https://www.91flac.com/search?keyword=%E9%99%88%E9%9B%AA%E5%87%9D',
        referrerPolicy: 'no-referrer-when-downgrade',
        body: '{"songIds":["228859369"]}',
        method: 'POST',
        mode: 'cors',
      });
      const res = await fetch('/song/links', {
        method: 'POST',
        body: JSON.stringify({ songIds: idList }),
      });
      // eslint-disable-next-line no-return-await
      return await res.json()
    }
    function calcMusicName(el) {
      return (
        el.querySelector('td:nth-child(1) a').innerText +
        el.querySelector('td:nth-child(2) a').innerText
      )
    }
    const SUFFIXS = ['flac', 'ape', 'mp3', 'aac', 'ogg'];
    function calcType(links) {
      const arr = Array.from(links);
      return SUFFIXS.find((suffix) => arr.some(([name]) => name.includes(suffix)))
    }
    function calcLink(links) {
      const arr = Array.from(links);
      let result;
      SUFFIXS.find((suffix) => {
        result = arr.find(([name]) => name.includes(suffix));
        return result
      });
      return result
    }

    async function downloadSelected() {
      const selectedTrList = getSelectedTrList();
      const selectedIdList = getSelectedIdList(selectedTrList);
      const links = await getLinks(selectedIdList);
      selectedTrList
        .map(($el, i) => ({
          el: $el,
          musicName: calcMusicName($el),
          id: selectedIdList[i],
          type: calcType(links[i]),
          link: calcLink(links[i]),
        }))
        .filter(({ link }) => link)
        .forEach(({ musicName, type, link }) =>
          downloadMusic(link, `${musicName}.${type}`),
        );
    }

    downloadSelected();
  }

  // eslint-disable-next-line no-undef
  unsafeWindow.batchDownload = batchDownload;
  // eslint-disable-next-line no-undef
  unsafeWindow.singleDownload = singleDownload;
  singleDownload();

}(rx));
