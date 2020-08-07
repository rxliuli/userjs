import * as React from 'react'
import { Card } from 'antd'

type PropsType = {}

/**
 * 首页
 */
const Home: React.FC<PropsType> = props => {
  return (
    <Card title={'首页'} style={{ width: '100%' }}>
      <h2>这是为了让吾辈能够在一个地方修改油猴脚本所添加的网站</h2>
    </Card>
  )
}

export default Home
