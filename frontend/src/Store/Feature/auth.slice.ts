import {
  createAction,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'

import type { RootState } from '@project/Store/store'
import type {
  AuthTokensNormalized,
  AuthUser,
  LoginResponse,
} from '@project/Types/Features/auth'

// ─── Reset action (global — resets entire store) ──────────────────────────────

export const resetStore = createAction('store/reset')

// ─── State ────────────────────────────────────────────────────────────────────

type AuthSliceState = AuthTokensNormalized & {
  userInfo: AuthUser | null
  /** True once tokens + userInfo have been populated (login or rehydration) */
  isHydrated: boolean
}

const initialState: AuthSliceState = {
  accessToken: '',
  refreshToken: '',
  refreshTokenExpiryTime: '',
  userInfo: null,
  isHydrated: false,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserLoginData(state, action: PayloadAction<LoginResponse>) {
      const { accessToken, refreshToken, refreshTokenExpiryTime, ...userInfo } =
        action.payload
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.refreshTokenExpiryTime = refreshTokenExpiryTime ?? ''
      state.userInfo = userInfo
      state.isHydrated = true
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },
    clearAuthState(state) {
      state.accessToken = ''
      state.refreshToken = ''
      state.refreshTokenExpiryTime = ''
      state.userInfo = null
      state.isHydrated = false
    },
  },

  // ─── extraReducers ──────────────────────────────────────────────────────────
  // Reacts to RTK Query lifecycle actions dispatched by authApi, without
  // importing authApi directly (which would create a circular dependency:
  // auth.slice → store → auth.api → auth.slice).
  //
  // RTK Query action type format: '<reducerPath>/executeQuery/fulfilled'
  // The endpointName is available on action.meta.arg.endpointName.
  extraReducers: (builder) => {
    // redux-persist fires REHYDRATE when it restores state from sessionStorage.
    // Without this, isHydrated stays false after a page refresh → blank screen.
    builder.addCase(REHYDRATE, (state, action) => {
      // The rehydrated auth payload may be partial — only mark hydrated if
      // tokens were actually restored (i.e. the user was logged in).
      const payload = (
        action as PayloadAction<{ auth?: AuthSliceState } | undefined>
      ).payload
      const restoredAuth = payload?.auth
      if (restoredAuth?.accessToken) {
        state.accessToken = restoredAuth.accessToken
        state.refreshToken = restoredAuth.refreshToken
        state.refreshTokenExpiryTime = restoredAuth.refreshTokenExpiryTime
        state.userInfo = restoredAuth.userInfo ?? null
      }
      // Always mark hydrated after REHYDRATE — even if no tokens were found.
      // This unblocks ProtectedRoute so it can redirect to /login instead of
      // rendering null forever.
      state.isHydrated = true
    })
    // When getProfile succeeds, sync the fresh user data into the slice.
    // RTK Query owns the cache and refetch logic; the slice owns the shape.
    builder.addMatcher(
      (action): action is PayloadAction<AuthUser> => {
        const a = action as PayloadAction<
          AuthUser,
          string,
          { arg: { endpointName: string } }
        >
        return (
          typeof a.type === 'string' &&
          a.type === 'authApi/executeQuery/fulfilled' &&
          a.meta.arg.endpointName === 'getProfile'
        )
      },
      (state, action) => {
        state.userInfo = action.payload
        state.isHydrated = true
      }
    )

    // When logout succeeds on the server, confirm the slice is fully cleared.
    // The optimistic clear in auth.api.ts onQueryStarted runs first —
    // this is the confirmed follow-through.
    builder.addMatcher(
      (action): action is PayloadAction => {
        const a = action as PayloadAction<
          undefined,
          string,
          { arg: { endpointName: string } }
        >
        return (
          typeof a.type === 'string' &&
          a.type === 'authApi/executeMutation/fulfilled' &&
          a.meta.arg.endpointName === 'logout'
        )
      },
      (state) => {
        state.accessToken = ''
        state.refreshToken = ''
        state.refreshTokenExpiryTime = ''
        state.userInfo = null
        state.isHydrated = false
      }
    )
  },
})

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { setUserLoginData, setAccessToken, clearAuthState } =
  authSlice.actions

// ─── Selectors ────────────────────────────────────────────────────────────────

const selectAuthState = (state: RootState): AuthSliceState => state.auth

export const selectAccessToken = createSelector(
  selectAuthState,
  ({ accessToken }): string => accessToken
)

export const selectRefreshToken = createSelector(
  selectAuthState,
  ({ refreshToken }): string => refreshToken
)

export const selectUserInfo = createSelector(
  selectAuthState,
  ({ userInfo }): AuthUser | null => userInfo
)

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  ({ accessToken }): boolean => !!accessToken
)

export const selectIsHydrated = createSelector(
  selectAuthState,
  ({ isHydrated }): boolean => isHydrated
)

/** Derived: full display name — avoids computing this in every component */
export const selectUserDisplayName = createSelector(
  selectUserInfo,
  (user): string => (user ? `${user.firstName} ${user.lastName}`.trim() : '')
)

/** Derived: current user's role */
export const selectUserRole = createSelector(
  selectUserInfo,
  (user) => user?.role ?? null
)

export default authSlice
