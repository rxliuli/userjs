/**
 * 新增的消息处理器
 */
class AddMsgProcessor {
  private tempMsgList: HTMLElement[] = []
  private flag = false

  process(item: HTMLElement) {
    const userName = item.querySelector('.tile-text')?.innerHTML
    if (userName === '大逗') {
      this.flag = true
      this.tempMsgList.push(item)
      return
    }
    if (!userName && this.flag) {
      this.tempMsgList.push(item)
      return
    }
  }

  private hide() {
    this.tempMsgList.forEach((item) => {
      console.log(
        '隐藏的消息: ',
        item.querySelector('.message-text')!.textContent,
      )
      item.style.display = 'none'
    })
  }
}

const addMsgProcessor = new AddMsgProcessor()

/**
 * 添加对消息列表的监听
 */
function addMsgListWatch() {
  const $msgList = document.querySelector('.messages-list-items')!
  new MutationObserver((mutations, observer) => {
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        ;([...mutation.addedNodes] as HTMLElement[]).forEach((item) =>
          addMsgProcessor.process(item),
        )
      }
    }
  }).observe($msgList, {
    childList: true,
  })
}

addMsgListWatch()
