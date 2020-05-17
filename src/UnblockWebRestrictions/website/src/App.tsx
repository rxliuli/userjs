import * as React from 'react'
import { Button, Card, Form, Input, List, message, Result, Select } from 'antd'
import { useEffect, useState } from 'react'

type PropsType = {}

const configTypeLabelMap: Record<TypeEnum, string> = {
  domain: '域名',
  link: '链接',
  linkPrefix: '链接前缀',
  regex: '正则表达式',
}

function match(
  href: URL,
  config:
    | string
    | { type: 'domain' | 'link' | 'linkPrefix' | 'regex'; url: string },
) {
  if (typeof config === 'string') {
    return href.host.includes(config)
  } else {
    const { type, url } = config
    switch (type) {
      case 'domain':
        return href.host.includes(url)
      case 'link':
        return href.href === url
      case 'linkPrefix':
        return href.href.startsWith(url)
      case 'regex':
        return new RegExp(url).test(href.href)
    }
  }
}

const App: React.FC<PropsType> = props => {
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

  const [form] = Form.useForm()

  function onReset() {
    form.resetFields()
  }

  function onFinish(values: Record<string, string>) {
    const _values = values as {
      type: TypeEnum
      url: string
      tempUrl: string
    }
    if (!match(new URL(_values.tempUrl), _values)) {
      message.warn('测试需要匹配的 URL 未能匹配！')
      return
    }
    window.configBlockApi.add({
      type: _values.type,
      url: _values.url,
    })
    message.success('添加成功')
    reload()
    onReset()
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
      <Form form={form} onFinish={onFinish} layout={'vertical'}>
        <Form.Item
          label={'匹配模式'}
          name={'type'}
          rules={[{ required: true }]}
        >
          <Select
            options={Object.entries(configTypeLabelMap).map(
              ([value, label]) => ({ label, value }),
            )}
          />
        </Form.Item>
        <Form.Item label={'匹配值'} name={'url'} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label={'测试需要匹配的 URL'}
          name={'tempUrl'}
          rules={[{ required: true }, { type: 'url' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType={'submit'}
            style={{
              marginRight: 8,
            }}
          >
            提交
          </Button>
          <Button htmlType={'reset'} onClick={onReset}>
            清空
          </Button>
        </Form.Item>
      </Form>
      <h2>本地屏蔽配置列表</h2>
      <List
        dataSource={configList}
        renderItem={(config: BlockConfig, i) => (
          <List.Item
            key={i}
            actions={[
              <Button type={'danger' as any} onClick={() => remove(config)}>
                删除
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={configTypeLabelMap[config.type]}
              description={
                <div
                  style={{
                    width: '100%',
                  }}
                  title={config.url}
                >
                  {config.url}
                </div>
              }
            />
          </List.Item>
        )}
        itemLayout={'vertical'}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
      />
    </Card>
  )
}

export default App
