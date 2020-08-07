import * as React from 'react'
import { Layout, Menu } from 'antd'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useState } from 'react'
import { allRouteList } from './constant/allRouteList'
import { ClickParam } from 'antd/es/menu'

type PropsType = {}

const LayoutHome: React.FC<PropsType> = () => {
  const [openKey, setOpenKey] = useState<string>('/')

  const history = useHistory()
  function handleClick(clickParam: ClickParam) {
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
            {allRouteList.map(config => (
              <Menu.Item key={config.path as string}>
                {config.meta.title}
              </Menu.Item>
            ))}
          </Menu>
        </Layout.Sider>
        <React.Suspense fallback={'正在加载中...'}>
          <Switch>
            {allRouteList.map((config, i) => (
              <Route {...config} key={i} />
            ))}
          </Switch>
        </React.Suspense>
      </Layout>
    </Layout>
  )
}

export default LayoutHome
