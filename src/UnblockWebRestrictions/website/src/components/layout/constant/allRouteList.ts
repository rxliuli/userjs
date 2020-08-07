import { RouteProps } from 'react-router'
import { lazy } from 'react'

interface RouteConfig extends RouteProps {
  meta: {
    title: string
  }
}

export const allRouteList: RouteConfig[] = [
  {
    path: '/',
    component: lazy(() => import('../../../pages/home/Home')),
    exact: true,
    meta: {
      title: '首页',
    },
  },
  {
    path: '/unblock',
    component: lazy(() =>
      import('../../../pages/unblock/UnblockWebRestrictionsConfig'),
    ),
    meta: {
      title: '解除网页限制',
    },
  },
  {
    path: '/telegramDuck',
    component: lazy(() =>
      import('../../../pages/telegramCute/TelegramDarkCuteConfig'),
    ),
    meta: {
      title: 'Telegram 暗黑模式萌化',
    },
  },
]
