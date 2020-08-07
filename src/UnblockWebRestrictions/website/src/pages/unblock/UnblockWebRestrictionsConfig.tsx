import * as React from 'react'
import { useState } from 'react'
import { Button, message, Result } from 'antd'
import UnblockWebRestrictionsConfigForm from './component/UnblockWebRestrictionsConfigForm'
import UnblockWebRestrictionsConfigList from './component/UnblockWebRestrictionsConfigList'
import BasicLayoutCard from '../../components/layout/BasicLayoutCard'

type PropsType = {}

const UnblockWebRestrictionsConfig: React.FC<PropsType> = () => {
  if (!window.configBlockApi) {
    return (
      <Result
        title="您还未安装解除网页禁止复制/粘贴的脚本"
        extra={
          <Button
            type={'primary'}
            href={'https://greasyfork.org/zh-CN/scripts/391193'}
          >
            去安装脚本
          </Button>
        }
      />
    )
  }

  const [configList, setConfigList] = useState(() =>
    window.configBlockApi.list(),
  )

  function handleReload() {
    const list = window.configBlockApi.list()
    setConfigList(list)
    console.log('reload: ', list)
  }
  function handleClear() {
    window.configBlockApi.clear()
    handleReload()
    message.success('清空成功')
  }

  async function handleUpdate() {
    await window.configBlockApi.update()
    handleReload()
    message.success('更新成功')
  }

  function handleRemove(config: BlockConfig) {
    console.log('remove key: ', config.key)
    window.configBlockApi.remove(config.key)
    handleReload()
    message.success('删除成功')
  }

  function handleSwitch(config: BlockConfig) {
    console.log('handleSwitch: ', config)
    window.configBlockApi.switch(config.key)
    handleReload()
  }

  return (
    <BasicLayoutCard
      title={'配置页'}
      extra={
        <div>
          <Button
            type="primary"
            onClick={handleClear}
            style={{ marginRight: 8 }}
          >
            清空
          </Button>
          <Button type="primary" onClick={handleUpdate}>
            更新
          </Button>
        </div>
      }
    >
      <UnblockWebRestrictionsConfigForm onReload={handleReload} />
      <UnblockWebRestrictionsConfigList
        list={configList}
        onRemove={handleRemove}
        onSwitch={handleSwitch}
      />
    </BasicLayoutCard>
  )
}

export default UnblockWebRestrictionsConfig
