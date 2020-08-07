import * as React from 'react'
import { Card, Layout, Menu } from 'antd'
import UnblockWebRestrictionsConfig from '../../pages/unblock/UnblockWebRestrictionsConfig'

type PropsType = {}

const LayoutHome: React.FC<PropsType> = () => {
  return (
    <Layout
      style={{
        height: '100%',
      }}
    >
      <Layout>
        <Layout.Sider>
          <h2
            style={{
              color: '#fff',
              margin: 4,
              textAlign: 'center',
            }}
          >
            脚本配置
          </h2>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1">解除网页限制</Menu.Item>
          </Menu>
        </Layout.Sider>
        <UnblockWebRestrictionsConfig />
      </Layout>
    </Layout>
  )
}

export default LayoutHome
