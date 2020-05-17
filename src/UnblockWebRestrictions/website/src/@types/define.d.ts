declare type TypeEnum = 'domain' | 'link' | 'linkPrefix' | 'regex'
/**
 * 屏蔽配置项类型
 */
declare type BlockConfig = {
  type: TypeEnum
  url: string
}

declare class ConfigBlockApi {
  list(): BlockConfig[]
  delete(config: BlockConfig): void
  add(config: BlockConfig): void
  clear(): void
  update(): Promise<void>
}

declare interface Window {
  configBlockApi: ConfigBlockApi
}
