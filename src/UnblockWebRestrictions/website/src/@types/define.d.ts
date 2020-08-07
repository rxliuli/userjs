declare type TypeEnum = 'domain' | 'link' | 'linkPrefix' | 'regex'
namespace UnblockWebRestrictions {
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
}

declare namespace TelegramDarkCute {
  interface Config {
    label: string
    imageUrl: string
    videoUrl: string
  }
  declare class ConfigApi {
    async list(): Promise<Config[]>
    get(): Config | undefined
    set(config: Config): void
  }
}

declare interface Window {
  'com.rxliuli.UnblockWebRestrictions.configBlockApi': UnblockWebRestrictions.ConfigBlockApi
  'com.rxliuli.TelegramDarkCute.configApi': TelegramDarkCute.ConfigApi
}
