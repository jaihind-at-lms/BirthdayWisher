import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { JSX } from 'react'

import { AppPaths } from '@project/Routes/paths'
import { selectIsAuthenticated, selectIsHydrated } from '@project/Store/Feature'
import { useAppSelector } from '@project/Store/hooks'

/**
 * Blocks unauthenticated users from accessing protected routes.
 *
 * - While the store is rehydrating from redux-persist, renders nothing
 *   (avoids a flash-redirect before tokens are loaded).
 * - Once hydrated: redirects to /login if not authenticated,
 *   preserving the intended destination in location state so we can
 *   redirect back after login.
 */
const ProtectedRoute = (): JSX.Element | null => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isHydrated = useAppSelector(selectIsHydrated)
  const location = useLocation()

  // Wait for redux-persist rehydration before making auth decisions
  if (!isHydrated) return null

  if (!isAuthenticated) {
    return <Navigate to={AppPaths.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
