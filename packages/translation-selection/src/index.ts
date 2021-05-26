import { DOMEditorUtil } from './util/DOMEditorUtil'
import {
  ITranslatorHandler,
  Translator,
} from '@liuli-util/google-translate-api-free'

class TranslatorHandler implements ITranslatorHandler {
  async handle<T>(url: string): Promise<T> {
    return await new Promise<T>((resolve, reject) =>
      GM_xmlhttpRequest({
        url,
        method: 'GET',
        responseType: 'json',
        onload: (response) => resolve(response.response),
        onerror: (response) => reject(response.error),
      }),
    )
  }
}

const translator = new Translator(new TranslatorHandler())

document.addEventListener('keydown', async (e) => {
  if (e.altKey && e.key === 't') {
    const text = DOMEditorUtil.getSelect()
    if (text === null) {
      return
    }

    const resp = await translator.translate(text, { from: 'auto', to: 'en' })
    console.log('translate resp: ', resp.text)
    GM_notification({
      text: '翻译完成: ' + resp.text,
      title: 'translate-chrome-plugin',
      image:
        'https://raw.githubusercontent.com/rxliuli/google-translate-api-browser/1acd03721eaea0e59b7289cd7fd5b8b463c0014a/examples/chrome-plugin-example/src/public/icon-48.png',
      timeout: 1000,
    })
    await DOMEditorUtil.writeClipboard(resp.text as string)
  }
})
