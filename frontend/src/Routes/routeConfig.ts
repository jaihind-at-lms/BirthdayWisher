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
const WishesPage = lazy(
  () => import('@project/Pages/Admin/WishesPage')
)
const DepartmentsPage = lazy(
  () => import('@project/Pages/Admin/DepartmentsPage')
)
const DesignationsPage = lazy(
  () => import('@project/Pages/Admin/DesignationsPage')
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
    label: 'Dashboard',
    icon: 'dashboard',
    showInNav: true,
    roles: [AppRole.ADMIN, AppRole.SUPER_ADMIN],
  },
  {
    path: AppPaths.ADMIN_USERS,
    component: UserManagementPage,
    layout: 'admin',
    label: 'Employees',
    icon: 'users',
    showInNav: true,
    roles: [AppRole.ADMIN, AppRole.SUPER_ADMIN],
  },
  {
    path: AppPaths.ADMIN_WISHES,
    component: WishesPage,
    layout: 'admin',
    label: 'Wishes',
    icon: 'wishes',
    showInNav: true,
    roles: [AppRole.ADMIN, AppRole.SUPER_ADMIN],
  },
  {
    path: AppPaths.ADMIN_DEPARTMENTS,
    component: DepartmentsPage,
    layout: 'admin',
    label: 'Departments',
    icon: 'departments',
    showInNav: true,
    roles: [AppRole.ADMIN, AppRole.SUPER_ADMIN],
  },
  {
    path: AppPaths.ADMIN_DESIGNATIONS,
    component: DesignationsPage,
    layout: 'admin',
    label: 'Designations',
    icon: 'designations',
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
