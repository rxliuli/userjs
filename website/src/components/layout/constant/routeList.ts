import { lazy } from 'react'
import { RouteConfig } from 'react-router-config'

type RouteMenuConfig = RouteConfig & {
  meta: {
    title: string
  }
}

export const routeList: RouteMenuConfig[] = [
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
    component: lazy(
      () => import('../../../pages/unblock/UnblockWebRestrictionsConfig'),
    ),
    meta: {
      title: '解除网页限制',
    },
  },
]
