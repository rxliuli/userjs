import * as React from 'react'
import LayoutHome from './components/layout/LayoutHome'
import { HashRouter } from 'react-router-dom'

type PropsType = {}

const App: React.FC<PropsType> = props => {
  return (
    <HashRouter>
      <LayoutHome />
    </HashRouter>
  )
}

export default App
