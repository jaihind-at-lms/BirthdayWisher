/** Supported gender values from the API */
export type AuthGender = 'male' | 'female' | 'other'

// ─── Roles ────────────────────────────────────────────────────────────────────

/**
 * All application roles as a const object.
 * Add new roles here — TypeScript propagates the change everywhere.
 */
export const AppRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
} as const

export type AppRoleType = (typeof AppRole)[keyof typeof AppRole]

export interface LoginRequest {
  username: string
  password: string
  expiresInMins: number
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: AuthGender
  image: string
  role: AppRoleType
}

/**
 * Token fields as returned by the API.
 * `refreshTokenExpiryTime` is optional because some endpoints omit it.
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  refreshTokenExpiryTime?: string
}

/** Full login response = user info + tokens */
export type LoginResponse = AuthUser & AuthTokens

/**
 * Normalized token state stored in Redux.
 * `refreshTokenExpiryTime` is always a string here (empty string = not set).
 */
export interface AuthTokensNormalized {
  accessToken: string
  refreshToken: string
  refreshTokenExpiryTime: string
}
