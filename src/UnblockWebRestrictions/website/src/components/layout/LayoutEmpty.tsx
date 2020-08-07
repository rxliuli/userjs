import * as React from 'react'
import { Result, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { ClickParam } from 'antd/es/menu'

type PropsType = {
  title: string
  href: string
}

const LayoutEmpty: React.FC<PropsType> = props => {
  return (
    <Result
      style={{
        width: '100%',
      }}
      title={props.title}
      extra={
        <Button type={'primary'} href={props.href}>
          去安装脚本
        </Button>
      }
    />
  )
}

export default LayoutEmpty
