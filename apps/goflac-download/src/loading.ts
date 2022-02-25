class Loading {
  private readonly container: HTMLDivElement
  constructor() {
    const root = document.createElement('div')
    root.innerHTML = `<div style="position: fixed; right: 10px; bottom: 10px">
  <section
    class="content"
    style="background-color: grey; color: white; font-size: 20px; padding: 10px"
  />
</div>
`

    this.container = root.querySelector('*') as HTMLDivElement
    document.body.append(this.container)
    this.hide()
  }
  show() {
    this.container.style.display = 'block'
  }
  update(content: string) {
    this.container.querySelector('.content')!.textContent = content
  }
  hide() {
    this.container.style.display = 'none'
  }
}

let instance: Loading
export function loading(content: string) {
  if (!instance) {
    instance = new Loading()
  }
  instance.show()
  instance.update(content)
  return instance
}
