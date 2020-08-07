import * as React from 'react'
import BasicLayoutCard from '../../components/layout/BasicLayoutCard'
import { Button, Divider, message, Select, Space } from 'antd'
import { useMemo, useState } from 'react'
import { useMount } from 'react-use'
import Config = TelegramDarkCute.Config
import LayoutEmpty from '../../components/layout/LayoutEmpty'

type PropsType = {}

const configApi = window['com.rxliuli.TelegramDarkCute.configApi']

/**
 * tg 暗黑模式萌化的配置页
 */
const TelegramDarkCuteConfig: React.FC<PropsType> = () => {
  if (!configApi) {
    return (
      <LayoutEmpty
        title="您还未安装 telegram 暗黑模式萌化的脚本"
        href={'https://greasyfork.org/zh-CN/scripts/404017'}
      />
    )
  }
  const [configList, setConfigList] = useState<Config[]>([])
  const [config, setConfig] = useState<Config>()
  useMount(async () => {
    const list = await configApi.list()
    setConfigList(list)
    const config = await configApi.get()
    await setConfig(config || list[0])
    console.log('list: ', list, config)
  })
  const value = useMemo(() => {
    const i = configList.findIndex(
      ({ videoUrl }) => videoUrl === config?.videoUrl,
    )
    return i === -1 ? undefined : i
  }, [configList, config])

  function handleSet() {
    configApi.set(config!)
    message.success('修改背景视频成功')
  }

  return (
    <BasicLayoutCard title={'Telegram 暗黑模式萌化'}>
      <header>
        <Space>
          <Select
            value={value}
            onChange={i => setConfig(configList[i])}
            style={{
              width: 200,
            }}
            options={configList.map((config, i) => ({
              label: config.label,
              value: i,
            }))}
            showSearch={true}
            optionFilterProp={'label'}
          />
          <Button type={'primary'} onClick={handleSet}>
            确定
          </Button>
        </Space>
      </header>
      <Divider />
      <section>
        {config && (
          <video
            src={config.videoUrl}
            poster={config.imageUrl}
            autoPlay={true}
            loop={true}
            controls={true}
            style={{ width: '100%' }}
          />
        )}
      </section>
    </BasicLayoutCard>
  )
}

export default TelegramDarkCuteConfig
