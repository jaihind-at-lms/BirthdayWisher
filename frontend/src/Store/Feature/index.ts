/**
 * Public API for the Store/Feature layer.
 * Import slice actions and selectors from here, not from individual slice files.
 *
 * @example
 *   import { selectIsAuthenticated, clearAuthState } from '@project/Store/Feature'
 */
export { default as authSlice } from './auth.slice'
export * from './auth.slice'
