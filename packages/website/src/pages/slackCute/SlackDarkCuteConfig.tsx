import * as React from 'react'
import LayoutEmpty from '../../components/layout/LayoutEmpty'
import BasicDarkCuteConfig from '../../components/cute/BasicDarkCuteConfig'

type PropsType = {}

/**
 * tg 暗黑模式萌化的配置页
 */
const SlackDarkCuteConfig: React.FC<PropsType> = () => {
  return (
    <BasicDarkCuteConfig
      title={'Slack 暗黑模式萌化'}
      configApi={window['com.rxliuli.SlackDarkCute.configApi']}
      empty={
        <LayoutEmpty
          title="您还未安装 slack 暗黑模式萌化的脚本"
          href={'https://greasyfork.org/zh-CN/scripts/404016'}
        />
      }
    />
  )
}

export default SlackDarkCuteConfig
