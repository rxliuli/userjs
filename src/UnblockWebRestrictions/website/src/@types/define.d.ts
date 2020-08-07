declare type TypeEnum = 'domain' | 'link' | 'linkPrefix' | 'regex'
/**
 * 屏蔽配置项类型
 */
declare type BlockConfig = {
  type: TypeEnum
  url: string
  enable: boolean
  key: string
}

declare class ConfigBlockApi {
  list(): BlockConfig[]
  remove(key: string): void
  switch(key: string): void
  add(config: BlockConfig): void
  clear(): void
  update(): Promise<void>
}

declare interface Window {
  ['com.rxliuli.UnblockWebRestrictions.configBlockApi']: ConfigBlockApi
}
