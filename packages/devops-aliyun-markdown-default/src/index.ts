window.addEventListener('load', () => {
  new MutationObserver(() => {
    const divEditor = document.querySelector(
      'div[title="切换到Markdown编辑器"]',
    ) as HTMLDivElement
    if (divEditor) {
      divEditor.click()
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
  })
})
