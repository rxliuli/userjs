import * as React from 'react'
import { CardProps } from 'antd/lib/card'
import { Card } from 'antd'

type PropsType = CardProps & {}

const BasicLayoutCard: React.FC<PropsType> = props => {
  return (
    <Card
      style={{
        width: '100%',
        overflowY: 'auto',
      }}
      {...props}
    />
  )
}

export default BasicLayoutCard
