export class DOMEditorUtil {
  static getSelect(): string | null {
    const selection = getSelection()
    if (!selection || selection.type === 'None') {
      return null
    }
    return selection.toString()
  }

  static async writeClipboard(text: string) {
    await navigator.clipboard.writeText(text)
  }
}
