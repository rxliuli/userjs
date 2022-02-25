export function findParentElement(
  el: HTMLElement,
  predicate: (el: HTMLElement) => boolean,
): HTMLElement | null {
  if (predicate(el)) {
    return el
  }
  const parentElement = el.parentElement
  if (parentElement === null) {
    return null
  }
  return findParentElement(parentElement, predicate)
}
