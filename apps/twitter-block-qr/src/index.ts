import { AsyncArray, asyncLimiting } from '@liuli-util/async'
import QrScanner from 'qr-scanner'
import { findParentElement } from './findParentElement'

let qrEngine: Worker

function get(src: string): string | null {
  return localStorage.getItem('twitter-block-qr__' + src)
}
function set(src: string, value: string | boolean) {
  localStorage.setItem('twitter-block-qr__' + src, value.toString())
}

async function containerQr(img: HTMLImageElement) {
  const resp = await fetch(img.src)
  const blob = await resp.blob()
  try {
    await QrScanner.scanImage(blob, {
      qrEngine: qrEngine,
    })
    return true
  } catch (e) {
    return false
  }
}

async function blockQrImages() {
  const list = Array.from(document.querySelectorAll('img')).filter(
    (item) => item.width > 100 && get(item.src) !== 'false',
  )
  console.log('list: ', list)
  await AsyncArray.forEach(list, async (img) => {
    const src = img.src
    const res = get(src) ?? (await containerQr(img))
    set(src, res)
    if (!res) {
      return
    } else {
      const findTweet = findParentElement(
        img,
        (item) => item.dataset.testid === 'tweet',
      )
      findTweet?.remove()
      console.log('屏蔽垃圾图片', findTweet)
    }
  })
}

window.addEventListener('load', async () => {
  qrEngine = (await QrScanner.createQrEngine()) as any
  new MutationObserver(asyncLimiting(blockQrImages, 1)).observe(document.body, {
    childList: true,
    subtree: true,
  })
})
