import { Navigate, Outlet } from 'react-router-dom'
import type { JSX } from 'react'

import { AppPaths } from '@project/Routes/paths'
import { selectIsHydrated, selectUserRole } from '@project/Store/Feature'
import { useAppSelector } from '@project/Store/hooks'
import type { AppRoleType } from '@project/Types/Features/auth'

interface RoleGuardProps {
  /** Roles that are allowed through. Empty = allow all authenticated users. */
  allowedRoles: AppRoleType[]
}

/**
 * Sits inside a ProtectedRoute — auth is already confirmed at this point.
 * Waits for redux-persist rehydration before checking the role, so a direct
 * URL hit (e.g. /admin/dashboard on page refresh) doesn't flash /unauthorized
 * while the store is still loading.
 */
const RoleGuard = ({ allowedRoles }: RoleGuardProps): JSX.Element | null => {
  const userRole = useAppSelector(selectUserRole)
  const isHydrated = useAppSelector(selectIsHydrated)

  // Wait for rehydration — same reason as ProtectedRoute
  if (!isHydrated) return null

  // No roles restriction = allow all authenticated users through
  if (allowedRoles.length === 0) return <Outlet />

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={AppPaths.UNAUTHORIZED} replace />
  }

  return <Outlet />
}

export default RoleGuard
