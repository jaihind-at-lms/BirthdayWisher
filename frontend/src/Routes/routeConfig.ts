import { lazy } from 'react'

import { AppRole } from '@project/Types/Features/auth'
import type { RouteConfig } from '@project/Types/Features/routes'

import { AppPaths } from './paths'

const AdminDashboardPage = lazy(
  () => import('@project/Pages/Admin/AdminDashboardPage')
)
const UserManagementPage = lazy(
  () => import('@project/Pages/Admin/UserManagementPage')
)
const NotFoundPage = lazy(() => import('@project/Pages/Errors/NotFoundPage'))
const UnauthorizedPage = lazy(
  () => import('@project/Pages/Errors/UnauthorizedPage')
)

export const protectedRoutes: RouteConfig[] = [
  {
    path: AppPaths.ADMIN_DASHBOARD,
    component: AdminDashboardPage,
    layout: 'admin',
    label: 'Admin Dashboard',
    icon: 'admin',
    showInNav: true,
    roles: [AppRole.ADMIN, AppRole.SUPER_ADMIN],
  },
  {
    path: AppPaths.ADMIN_USERS,
    component: UserManagementPage,
    layout: 'admin',
    label: 'User Management',
    icon: 'users',
    showInNav: true,
    roles: [AppRole.ADMIN, AppRole.SUPER_ADMIN],
  },
]

export const errorRoutes: RouteConfig[] = [
  {
    path: AppPaths.UNAUTHORIZED,
    component: UnauthorizedPage,
    layout: 'none',
  },
  {
    path: AppPaths.NOT_FOUND,
    component: NotFoundPage,
    layout: 'none',
  },
]
