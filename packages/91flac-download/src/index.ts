import { createElByString, download, singleModel, wait } from 'rx-util'

/**
 * 简单的弹窗组件
 */
const Loading = singleModel(
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
      // eslint-disable-next-line no-undef
      document.body.append(createElByString(LoadingText)!)
      this.hide()
    }
    show() {
      ;(document.querySelector('.rx-loading') as HTMLElement).style.display =
        'block'
    }
    hide() {
      ;(document.querySelector('.rx-loading') as HTMLElement).style.display =
        'none'
    }
    progress(num: number) {
      ;(document.querySelector(
        '.rx-loading .loading-progress',
      ) as HTMLElement).innerHTML = num.toString()
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
function downloadMusic(url: string, name: string) {
  const loading = load()
  // eslint-disable-next-line no-undef
  GM_xmlhttpRequest({
    method: 'GET',
    responseType: 'blob',
    url,
    onload(res: any) {
      // eslint-disable-next-line no-undef
      download(res.response, name)
      loading.hide()
    },
    onprogress(res: any) {
      if (res.readyState !== 3) {
        return
      }
      const num = Math.floor(((res as any).done * 100) / res.total)
      loading.progress(num)
    },
  } as any)
}

type ClickEventParam = {
  el: HTMLLinkElement
  suffix: string
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
  const MusicTypeList = ['flac', 'ape', 'mp3', 'aac', 'ogg', 'm4a']
  const EmptyHref = 'javascript:void(0)'

  /**
   * 获取所有可用的下载按钮列表
   */
  function getBtnList() {
    function predicate($elem: HTMLElement) {
      if (!MusicTypeList.some((type) => $elem.dataset.type!.includes(type))) {
        return false
      }
      const $btn = $elem.querySelector('a.btn') as HTMLLinkElement
      return !(
        $btn === null ||
        $btn.classList.contains('disabled') ||
        $btn.href === EmptyHref
      )
    }
    return (Array.from(document.querySelectorAll('.download')) as HTMLElement[])
      .filter(predicate)
      .map(
        ($elem) =>
          ({
            el: $elem.querySelector('a.btn'),
            suffix: $elem.dataset.type,
          } as ClickEventParam),
      )
  }

  /**
   * 获取当前页面的歌曲名
   */
  function getMusicName() {
    return document.querySelector('.rounded .h3')!.innerHTML
  }

  /**
   * 添加事件
   * @param {object} option 选项
   * @param {Element} option.el 按钮元素
   * @param {string} option.suffix 后缀名
   */
  function addClickEvent({ el, suffix }: ClickEventParam) {
    const url = el.href
    el.addEventListener('click', function () {
      downloadMusic(url, `${getMusicName()}.${suffix}`)
    })
    el.href = EmptyHref
    el.removeAttribute('target')
  }

  ;(async () => {
    // 等待全部按钮都加载完毕
    // eslint-disable-next-line no-undef
    await wait(() =>
      (Array.from(
        document.querySelectorAll('.download a.btn'),
      ) as HTMLLinkElement[]).every(($el) => $el.innerText !== '加载中...'),
    )
    getBtnList().forEach(addClickEvent)
  })()
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
      ($el) =>
        ($el.querySelector('td input[type="checkbox"]') as HTMLInputElement)
          .checked,
    ) as HTMLElement[]
  }
  function getSelectedIdList(trList: HTMLElement[]) {
    return trList.map(
      ($el) =>
        ($el.querySelector('td input[type="checkbox"]') as HTMLInputElement)
          .value,
    )
  }
  async function getLinks(idList: string[]) {
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
    })
    const res = await fetch('/song/links', {
      method: 'POST',
      body: JSON.stringify({ songIds: idList }),
    })
    // eslint-disable-next-line no-return-await
    return await res.json()
  }
  function calcMusicName(el: HTMLElement) {
    return (
      (el.querySelector('td:nth-child(1) a') as HTMLElement).innerText +
      (el.querySelector('td:nth-child(2) a') as HTMLElement).innerText
    )
  }
  const SUFFIXS = ['flac', 'ape', 'mp3', 'aac', 'ogg']
  function calcType(links: string[]) {
    const arr = Array.from(links)
    return SUFFIXS.find((suffix) => arr.some(([name]) => name.includes(suffix)))
  }
  function calcLink(links: string[]): string | undefined {
    const arr = Array.from(links)
    let result
    SUFFIXS.find((suffix) => {
      result = arr.find(([name]) => name.includes(suffix))
      return result
    })
    return result
  }

  async function downloadSelected() {
    const selectedTrList = getSelectedTrList()
    const selectedIdList = getSelectedIdList(selectedTrList)
    const links = await getLinks(selectedIdList)
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
        downloadMusic(link!, `${musicName}.${type}`),
      )
  }

  downloadSelected()
}

Reflect.set(unsafeWindow, 'batchDownload', batchDownload)
Reflect.set(unsafeWindow, 'singleDownload', singleDownload)
singleDownload()
