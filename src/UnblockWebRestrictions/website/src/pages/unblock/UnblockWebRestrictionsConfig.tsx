import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button, Card, message, Result } from 'antd'
import UnblockWebRestrictionsConfigForm from './component/UnblockWebRestrictionsConfigForm'
import UnblockWebRestrictionsConfigList from './component/UnblockWebRestrictionsConfigList'

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

  useEffect(() => {
    console.log('useEffect: ', configList)
  }, [])

  function reload() {
    setConfigList(window.configBlockApi.list())
  }
  function clear() {
    window.configBlockApi.clear()
    reload()
    message.success('清空成功')
  }

  async function update() {
    await window.configBlockApi.update()
    reload()
    message.success('更新成功')
  }

  function remove(config: BlockConfig) {
    window.configBlockApi.delete(config)
    reload()
    message.success('删除成功')
  }

  return (
    <Card
      title={'配置页'}
      extra={
        <div>
          <Button type="primary" onClick={clear} style={{ marginRight: 8 }}>
            清空
          </Button>
          <Button type="primary" onClick={update}>
            更新
          </Button>
        </div>
      }
    >
      <UnblockWebRestrictionsConfigForm onReload={reload} />
      <UnblockWebRestrictionsConfigList list={configList} onRemove={remove} />
    </Card>
  )
}

export default UnblockWebRestrictionsConfig
