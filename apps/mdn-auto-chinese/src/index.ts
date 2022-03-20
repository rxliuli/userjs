function parseLocales(): string[] {
  return JSON.parse(
    document.querySelector('#hydration')!.textContent!,
  ).doc.other_translations.map((item: { locale: string }) => item.locale)
}

/**
 * MDN 自动跳转中文翻译
 * 如果来到一个 MDN 的网页
 * 判断当前页面是否为中文
 *    - 如果是，就不进行任何操作
 *    - 否则判断当前页面是否有中文翻译页面
 *      - 如果没有，则不进行任何操作
 *      - 否则跳转至中文翻译页面
 */
function goto() {
  // 获取 language
  const language = new RegExp('https://developer.mozilla.org/(.*?)/').exec(
    location.href,
  )![1]

  // 判断 language 是否为中文
  if (language === 'zh-CN') {
    return
  }

  // 获取可能存在的中文翻译页面
  const someZhCN = parseLocales().includes('zh-CN')

  // 如果有就跳转过去
  if (someZhCN) {
    location.href = location.href.replace(language, 'zh-CN')
  }
}

goto()
