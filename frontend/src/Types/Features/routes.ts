import type { ComponentType, LazyExoticComponent } from 'react'

import type { AppRoleType } from './auth'

/**
 * A single route definition.
 * The route config array is the single source of truth for the entire app's
 * navigation — permissions, layouts, and lazy components all live here.
 */
export interface RouteConfig {
  /** URL path segment */
  path: string
  /** Lazy-loaded page component */
  component: LazyExoticComponent<ComponentType>
  /**
   * Which roles can access this route.
   * - `undefined` / omitted → accessible to ALL authenticated users
   * - empty array `[]`     → public route (no auth required)
   * - populated array      → only those roles can access
   */
  roles?: AppRoleType[]
  /** Layout wrapper to use for this route */
  layout?: 'admin' | 'main' | 'none'
  /** Human-readable label (used in nav menus, breadcrumbs) */
  label?: string
  /** Icon name or component key for sidebar/nav rendering */
  icon?: string
  /** Whether to show this route in navigation menus */
  showInNav?: boolean
  /** Nested child routes */
  children?: RouteConfig[]
}
