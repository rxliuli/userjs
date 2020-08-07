import * as React from 'react'
import { Button, List, Switch, Tag } from 'antd'
import { configTypeLabelMap } from '../constant/configTypeLabelMap'

type PropsType = {
  list: BlockConfig[]
  onRemove: (config: BlockConfig) => void
  onSwitch: (config: BlockConfig) => void
}

/**
 * 屏蔽列表
 */
const UnblockWebRestrictionsConfigList: React.FC<PropsType> = props => {
  return (
    <div>
      <h2>本地屏蔽配置列表</h2>
      <List
        dataSource={props.list}
        renderItem={(config: BlockConfig, i: number) => (
          <List.Item
            key={i}
            actions={[
              <Switch
                checked={config.enable}
                onChange={() => props.onSwitch(config)}
              />,
              <Button
                type={'danger' as any}
                onClick={() => props.onRemove(config)}
              >
                删除
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <div>
                  <Tag>{configTypeLabelMap[config.type]}</Tag>
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={config.url}
                  >
                    {config.type === 'regex' ? (
                      config.url
                    ) : (
                      <a
                        href={
                          (config.type === 'domain' ? 'https://' : '') +
                          config.url
                        }
                      >
                        {config.url}
                      </a>
                    )}
                  </span>
                </div>
              }
              description={<div>{config.enable}</div>}
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default UnblockWebRestrictionsConfigList
