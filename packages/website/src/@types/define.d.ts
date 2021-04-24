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

    add(config: Pick<BlockConfig, 'type' | 'url'>): void

    clear(): void

    update(): Promise<void>
  }
}

declare namespace DarkCute {
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
  configBlockApi: ConfigBlockApi
  'com.rxliuli.UnblockWebRestrictions.configBlockApi'?: UnblockWebRestrictions.ConfigBlockApi
  'com.rxliuli.TelegramDarkCute.configApi'?: DarkCute.ConfigApi
  'com.rxliuli.SlackDarkCute.configApi'?: DarkCute.ConfigApi
}
