import { addOtherStyle, Config } from 'common-dark-cute'

class ConfigApi {
  async list(): Promise<Config[]> {
    return new Promise<Config[]>((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://userjs.rxliuli.com/data.json',
        onload(res) {
          resolve(JSON.parse(res.responseText))
        },
        onerror(e) {
          reject(e)
        },
      })
    })
  }

  private static readonly CurrentBackgroundVideoKey = 'CurrentBackgroundVideo'

  get() {
    try {
      return JSON.parse(GM_getValue(ConfigApi.CurrentBackgroundVideoKey))
    } catch (e) {}
  }
  set(config: Config) {
    return GM_setValue(
      ConfigApi.CurrentBackgroundVideoKey,
      JSON.stringify(config),
    )
  }
}
const configApi = new ConfigApi()

function setBackVideo(config: Config) {
  /**
   * 根据 html 字符串创建 Element 元素
   * @param str html 字符串
   * @returns 创建的 Element 元素
   */
  function createElByString(str: string): HTMLElement {
    const root = document.createElement('div')
    root.innerHTML = str
    return root.querySelector('*') as HTMLElement
  }

  const $videoEl = createElByString(`<video
  id="videoWallPaper"
  muted="muted"
  loop="loop"
  autoplay="autoplay"
  src="${config.videoUrl}"
/>
`)
  GM_addStyle(`video#videoWallPaper {
  position: fixed;
  right: 0;
  bottom: 0;

  min-width: 100%;
  min-height: 100%;

  width: auto;
  height: auto;
  z-index: -100;

  background-image: url(${config.imageUrl || ''});
  background-repeat: no-repeat;
  background-size: cover;
  filter: brightness(0.5);
}
`)
  document.body.appendChild($videoEl)
}

if (window.location.hostname === 'evgeny-nadymov.github.io') {
  const config = configApi.get()
  if (config) {
    setBackVideo(config)
    addOtherStyle()
  }
}

if (
  location.href.startsWith('https://userjs.rxliuli.com/') ||
  location.hostname === '127.0.0.1'
) {
  Reflect.set(unsafeWindow, 'com.rxliuli.TelegramDarkCute.configApi', configApi)
}
