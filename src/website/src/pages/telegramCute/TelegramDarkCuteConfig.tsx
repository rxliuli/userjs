import * as React from 'react'
import LayoutEmpty from '../../components/layout/LayoutEmpty'
import BasicDarkCuteConfig from '../../components/cute/BasicDarkCuteConfig'

type PropsType = {}

/**
 * tg 暗黑模式萌化的配置页
 */
const TelegramDarkCuteConfig: React.FC<PropsType> = () => {
  return (
    <BasicDarkCuteConfig
      configApi={window['com.rxliuli.TelegramDarkCute.configApi']}
      empty={
        <LayoutEmpty
          title="您还未安装 telegram 暗黑模式萌化的脚本"
          href={'https://greasyfork.org/zh-CN/scripts/404017'}
        />
      }
      title={'Telegram 暗黑模式萌化'}
    />
  )
}

export default TelegramDarkCuteConfig
