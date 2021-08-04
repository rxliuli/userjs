import { download } from '@liuli-util/dom'
import { wait } from '@liuli-util/async'
import { loading } from './loading'

/**
 * 下载歌曲
 * @param {string} url 链接
 * @param {string} name 歌曲全名，包括后缀
 */
function downloadMusic(url: string, name: string) {
  const instance = loading('正在下载... 0%')
  // eslint-disable-next-line no-undef
  GM_xmlhttpRequest({
    method: 'GET',
    responseType: 'blob',
    url,
    onload(res: any) {
      // eslint-disable-next-line no-undef
      download(res.response, name)
      instance.hide()
    },
    onprogress(res: any) {
      if (res.readyState !== 3) {
        return
      }
      const num = Math.floor(((res as any).done * 100) / res.total)
      instance.update(`正在下载... ${num}%`)
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

function insertCSS(href: string) {
  const linkElement = document.createElement('link')
  linkElement.rel = 'stylesheet'
  linkElement.href = href
  document.head.appendChild(linkElement)
}

function main() {
  insertCSS(
    'https://cdn.jsdelivr.net/npm/sweetalert2@11.1.0/dist/sweetalert2.css',
  )
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
