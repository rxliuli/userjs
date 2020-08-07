export function match(
  href: URL,
  config:
    | string
    | { type: 'domain' | 'link' | 'linkPrefix' | 'regex'; url: string },
) {
  if (typeof config === 'string') {
    return href.host.includes(config)
  } else {
    const {type, url} = config
    switch (type) {
      case 'domain':
        return href.host.includes(url)
      case 'link':
        return href.href === url
      case 'linkPrefix':
        return href.href.startsWith(url)
      case 'regex':
        return new RegExp(url).test(href.href)
    }
  }
}
