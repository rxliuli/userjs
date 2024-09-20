import { Button, Form, Input, message, Select, Space } from 'antd'
import { match } from '../util/match'
import {
  configBlockApi,
  configTypeLabelMap,
} from '../constant/configTypeLabelMap'
import * as React from 'react'
import BlockConfig = UnblockWebRestrictions.BlockConfig
import { pick } from '@liuli-util/object'

/**
 * 配置新增表单
 */
const UnblockWebRestrictionsConfigForm: React.FC<{
  onReload: () => void
}> = (props) => {
  const [form] = Form.useForm()

  function onReset() {
    form.resetFields()
  }

  async function onFinish(values: Record<string, string>) {
    console.log('values: ', values)
    const _values = values as Pick<BlockConfig, 'type' | 'url'> & {
      tempUrl: string
    }
    configBlockApi.add(pick(_values, 'type', 'url'))
    message.success('添加成功')
    props.onReload()
    onReset()
  }

  return (
    <Form form={form} onFinish={onFinish} onReset={onReset} layout={'vertical'}>
      <Form.Item
        label={'匹配模式'}
        name={'type'}
        rules={[{ required: true, message: '匹配模式没有选择' }]}
      >
        <Select
          options={Object.entries(configTypeLabelMap).map(([value, label]) => ({
            label,
            value,
          }))}
        />
      </Form.Item>
      <Form.Item
        label={'匹配值'}
        name={'url'}
        rules={[{ required: true, message: '匹配值不能为空' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.type !== currentValues.type
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue('type') === 'regex' ? (
            <Form.Item
              label={'测试需要匹配的 URL'}
              name={'tempUrl'}
              rules={[
                {
                  required: true,
                  type: 'url',
                  message: '测试需要匹配的 URL 必须是个 URL 啊喂 (#`O′)',
                },
                (form) => ({
                  async validator(rule, _) {
                    const values = form.getFieldsValue() as Pick<
                      BlockConfig,
                      'type' | 'url'
                    > & { tempUrl: string }
                    if (!values.tempUrl) {
                      throw new Error('测试需要匹配的 URL 不能为空')
                    }
                    if (!match(new URL(values.tempUrl), values)) {
                      throw new Error('测试需要匹配的 URL 未能匹配！')
                    }
                  },
                }),
              ]}
              dependencies={['type', 'url']}
            >
              <Input />
            </Form.Item>
          ) : null
        }}
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType={'submit'}>
            提交
          </Button>
          <Button htmlType={'reset'}>清空</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default UnblockWebRestrictionsConfigForm
