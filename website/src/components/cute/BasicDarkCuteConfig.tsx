import * as React from 'react'
import BasicLayoutCard from '../../components/layout/BasicLayoutCard'
import { Button, Divider, message, Select, Space } from 'antd'
import { ReactElement, useMemo, useState } from 'react'
import { useMount } from 'react-use'
type Config = DarkCute.Config

type PropsType = {
  configApi?: DarkCute.ConfigApi
  empty: ReactElement
  title: string
}

const BasicDarkCuteConfigNotEmpty: React.FC<Omit<PropsType, 'empty'>> = (
  props,
) => {
  const [configList, setConfigList] = useState<Config[]>([])
  const [config, setConfig] = useState<Config>()
  useMount(async () => {
    const list = await props.configApi!.list()
    setConfigList(list)
    const config = await props.configApi!.get()
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
    props.configApi!.set(config!)
    message.success('修改背景视频成功')
  }

  return (
    <BasicLayoutCard title={props.title}>
      <header>
        <Space>
          <Select
            value={value}
            onChange={(i) => setConfig(configList[i])}
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

/**
 * 暗黑模式萌化的配置页
 */
const BasicDarkCuteConfig: React.FC<PropsType> = (props) => {
  return !props.configApi ? (
    props.empty
  ) : (
    <BasicDarkCuteConfigNotEmpty {...props} />
  )
}

export default BasicDarkCuteConfig
