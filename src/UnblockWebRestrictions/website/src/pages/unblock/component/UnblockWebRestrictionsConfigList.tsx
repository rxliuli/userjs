import * as React from 'react'
import { Button, List } from 'antd'
import { configTypeLabelMap } from '../constant/configTypeLabelMap'

type PropsType = {
  list: BlockConfig[]
  onRemove: (config: BlockConfig) => void
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
              <Button
                type={'danger' as any}
                onClick={() => props.onRemove(config)}
              >
                删除
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={<div>{configTypeLabelMap[config.type]}</div>}
              description={
                <div
                  style={{
                    width: 240,
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
    </div>
  )
}

export default UnblockWebRestrictionsConfigList
