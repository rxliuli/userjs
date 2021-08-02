import { createElByString, download, singleModel } from 'rx-util'
import { wait } from '@liuli-util/async'

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

function getMusicName() {
  const titleElement = document.querySelector(
    'main .space-y-2 .inline',
  ) as HTMLDivElement
  return titleElement.textContent!.replaceAll(' ', '')
}

function getLink() {
  return (document.querySelector('div.mt-4 a') as HTMLLinkElement).href
}

function addMask(el: HTMLDivElement) {
  const mask = document.createElement('div')
  mask.style.position = 'absolute'
  mask.style.left = '0'
  mask.style.right = '0'
  mask.style.top = '0'
  mask.style.bottom = '0'
  el.style.position = 'relative'
  el.appendChild(mask)
}

enum TypeEnum {
  Flac,
  HighMp3,
  BasicMp3,
  HighOGG,
  HighAAC,
  BasicAAC,
}

const textToTypeMap: Record<TypeEnum, string[]> = {
  [TypeEnum.Flac]: ['flac'],
  [TypeEnum.HighMp3]: ['极高', 'mp3'],
  [TypeEnum.BasicMp3]: ['标准', 'mp3'],
  [TypeEnum.HighOGG]: ['较高', 'ogg'],
  [TypeEnum.HighAAC]: ['较高', 'aac'],
  [TypeEnum.BasicAAC]: ['标准', 'aac'],
}
const typeToExtMap: Record<TypeEnum, string> = {
  [TypeEnum.Flac]: 'flac',
  [TypeEnum.HighMp3]: 'mp3',
  [TypeEnum.BasicMp3]: 'mp3',
  [TypeEnum.HighOGG]: 'ogg',
  [TypeEnum.HighAAC]: 'aac',
  [TypeEnum.BasicAAC]: 'aac',
}

function getType(text: string): TypeEnum | null {
  text = text.toLocaleLowerCase()
  for (let [k, v] of Object.entries(textToTypeMap)) {
    if (v.every((s) => text.includes(s))) {
      return (k as unknown) as TypeEnum
    }
  }
  return null
}

function hideDialog() {
  const dialogStyle = (document.querySelector(
    '.jetstream-modal',
  ) as HTMLDivElement).style
  dialogStyle.zIndex = '-100'
  dialogStyle.display = 'none'
  dialogStyle.position = 'fixed'
  dialogStyle.left = '-10000px'
}

function main() {
  const downloadButtonList = document.getElementsByClassName('-m-2')[1]
  hideDialog()
  downloadButtonList.addEventListener('click', async (evt) => {
    const target = evt.target as HTMLButtonElement
    const text = target.textContent
    const type = getType(text!)!
    const currLink = getLink()
    await wait(() => getLink() !== currLink)
    downloadMusic(getLink(), getMusicName() + '.' + typeToExtMap[type])
    hideDialog()
  })
}

window.addEventListener('load', main)
