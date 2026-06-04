import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { JSX } from 'react'

import { getDefaultPathForRole } from '@project/Routes/paths'
import { selectIsAuthenticated, selectUserRole } from '@project/Store/Feature'
import { useAppSelector } from '@project/Store/hooks'

/**
 * Prevents authenticated users from accessing guest-only routes (e.g. /login).
 * Redirects them to their role-appropriate default page instead.
 *
 * Also handles the post-login redirect: if the user was sent to /login
 * from a protected route, `location.state.from` holds the original path.
 */
const GuestRoute = (): JSX.Element => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userRole = useAppSelector(selectUserRole)
  const location = useLocation()

  if (isAuthenticated) {
    // Redirect back to where they came from, or their role's default page
    const from = (location.state as { from?: Location } | null)?.from?.pathname
    const fallback = getDefaultPathForRole(userRole)
    return <Navigate to={from ?? fallback} replace />
  }

  return <Outlet />
}

export default GuestRoute
