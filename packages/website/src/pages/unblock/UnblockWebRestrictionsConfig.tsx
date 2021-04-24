import * as React from 'react'
import { useState } from 'react'
import { Button, message } from 'antd'
import UnblockWebRestrictionsConfigForm from './component/UnblockWebRestrictionsConfigForm'
import UnblockWebRestrictionsConfigList from './component/UnblockWebRestrictionsConfigList'
import BasicLayoutCard from '../../components/layout/BasicLayoutCard'
import LayoutEmpty from '../../components/layout/LayoutEmpty'
import { configBlockApi } from './constant/configTypeLabelMap'

type BlockConfig = UnblockWebRestrictions.BlockConfig

type PropsType = {}

const UnblockWebRestrictionsConfigNotEmpty: React.FC<PropsType> = () => {
  const [configList, setConfigList] = useState(() => configBlockApi.list())

  function handleReload() {
    const list = configBlockApi.list()
    setConfigList(list)
    console.log('reload: ', list)
  }

  function handleClear() {
    configBlockApi.clear()
    handleReload()
    message.success('清空成功')
  }

  async function handleUpdate() {
    await configBlockApi.update()
    handleReload()
    message.success('更新成功')
  }

  function handleRemove(config: BlockConfig) {
    console.log('remove key: ', config.key)
    configBlockApi.remove(config.key)
    handleReload()
    message.success('删除成功')
  }

  function handleSwitch(config: BlockConfig) {
    console.log('handleSwitch: ', config)
    configBlockApi.switch(config.key)
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
const UnblockWebRestrictionsConfig: React.FC<PropsType> = () => {
  return !configBlockApi ? (
    <LayoutEmpty
      title="您还未安装解除网页禁止复制/粘贴的脚本"
      href={'https://greasyfork.org/zh-CN/scripts/391193'}
    />
  ) : (
    <UnblockWebRestrictionsConfigNotEmpty />
  )
}

export default UnblockWebRestrictionsConfig
