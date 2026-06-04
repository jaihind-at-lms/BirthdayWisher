import { lazy, Suspense } from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'
import type { JSX } from 'react'

import { selectUserRole } from '@project/Store/Feature'
import { useAppSelector } from '@project/Store/hooks'
import type { RouteConfig } from '@project/Types/Features/routes'

import GuestRoute from './guards/GuestRoute'
import ProtectedRoute from './guards/ProtectedRoute'
import RoleGuard from './guards/RoleGuard'
import LayoutRenderer from './LayoutRenderer'
import { AppPaths, getDefaultPathForRole } from './paths'
import { errorRoutes, protectedRoutes } from './routeConfig'

const LoginPage = lazy(() => import('@project/Pages/Login/LoginPage'))

// ─── Route renderer ───────────────────────────────────────────────────────────
// Recursively renders a RouteConfig entry with its layout and role guard.
// Supports nested children for future sub-route needs.

const renderRoute = (route: RouteConfig): JSX.Element => {
  const { path, component: Page, roles, layout, children } = route

  const pageRoute = (
    <Route path={path} element={<Page />}>
      {children?.map(renderRoute)}
    </Route>
  )

  // Routes with specific roles get a RoleGuard wrapper Route
  const guarded = roles?.length ? (
    <Route element={<RoleGuard allowedRoles={roles} />}>{pageRoute}</Route>
  ) : (
    pageRoute
  )

  // Wrap in a layout-scoped Route so each layout gets its own Outlet
  return (
    <Route key={path} element={<LayoutRenderer layout={layout} />}>
      {guarded}
    </Route>
  )
}

// ─── AppRoutes ────────────────────────────────────────────────────────────────

const AppRoutes = (): JSX.Element => {
  const userRole = useAppSelector(selectUserRole)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Root redirect → role-aware default page */}
        <Route
          index
          element={<Navigate to={getDefaultPathForRole(userRole)} replace />}
        />

        {/* Guest-only routes (redirect authenticated users away) */}
        <Route element={<GuestRoute />}>
          <Route path={AppPaths.LOGIN} element={<LoginPage />} />
        </Route>

        {/* All protected routes — auth check happens here */}
        <Route element={<ProtectedRoute />}>
          {protectedRoutes.map(renderRoute)}
        </Route>

        {/* Error pages — no auth required */}
        {errorRoutes.map((route) => (
          <Route
            key={route.path}
            element={<LayoutRenderer layout={route.layout} />}
          >
            <Route path={route.path} element={<route.component />} />
          </Route>
        ))}
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
