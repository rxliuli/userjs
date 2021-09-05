import * as React from 'react'
import { Layout, Menu } from 'antd'
import { Switch, useHistory } from 'react-router-dom'
import { useState } from 'react'
import { routeList } from './constant/routeList'
import { renderRoutes } from 'react-router-config'

type PropsType = {}

const LayoutHome: React.FC<PropsType> = () => {
  const [openKey, setOpenKey] = useState<string>('/')

  const history = useHistory()
  function handleClick(clickParam: any) {
    console.log('handleOpenChange: ', clickParam)
    history.push(clickParam.key)
    setOpenKey(clickParam.key)
  }

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
              verticalAlign: 'middle',
              height: 48,
              lineHeight: '48px',
            }}
          >
            脚本配置
          </h2>
          <Menu
            openKeys={[openKey]}
            onClick={handleClick}
            mode="inline"
            style={{ height: 'calc(100% - 56px)', borderRight: 0 }}
          >
            {routeList.map((config) => (
              <Menu.Item key={config.path as string}>
                {config.meta.title}
              </Menu.Item>
            ))}
          </Menu>
        </Layout.Sider>
        <React.Suspense fallback={'正在加载中...'}>
          <Switch>{renderRoutes(routeList)}</Switch>
        </React.Suspense>
      </Layout>
    </Layout>
  )
}

export default LayoutHome
