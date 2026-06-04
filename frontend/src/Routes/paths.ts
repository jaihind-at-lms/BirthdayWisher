import { AppRole, type AppRoleType } from '@project/Types/Features/auth'

/**
 * All application paths in one place.
 * Never hardcode URL strings in components — always import from here.
 * This makes refactoring paths a one-line change.
 */
export const AppPaths = {
  LOGIN: '/login',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_QUOTES: '/admin/quotes',
  ADMIN_DEPARTMENTS: '/admin/departments',
  ADMIN_DESIGNATIONS: '/admin/designations',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
} as const

export type AppPathType = (typeof AppPaths)[keyof typeof AppPaths]

/**
 * Maps each role to the page they land on after login.
 */
export const ROLE_DEFAULT_PATHS: Record<AppRoleType, string> = {
  [AppRole.SUPER_ADMIN]: AppPaths.ADMIN_DASHBOARD,
  [AppRole.ADMIN]: AppPaths.ADMIN_DASHBOARD,
}

export const getDefaultPathForRole = (role: AppRoleType | null): string =>
  role ? ROLE_DEFAULT_PATHS[role] : AppPaths.LOGIN
