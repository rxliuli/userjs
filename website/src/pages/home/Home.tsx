import * as React from 'react'
import BasicLayoutCard from '../../components/layout/BasicLayoutCard'

type PropsType = {}

/**
 * 首页
 */
const Home: React.FC<PropsType> = () => {
  return (
    <BasicLayoutCard title={'首页'}>
      <h2>这是为了让吾辈能够在一个地方修改油猴脚本所添加的网站</h2>
    </BasicLayoutCard>
  )
}

export default Home
