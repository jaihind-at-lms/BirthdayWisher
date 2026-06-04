import { createApi } from '@reduxjs/toolkit/query/react'

import type { ApiResponse } from '@project/Types/Api'
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from '@project/Types/Features/auth'
import { AppRole } from '@project/Types/Features/auth'
import {
  removeSessionStorage,
  setSessionStorage,
} from '@project/Utils/browserStorage'

import axiosBaseQuery from './baseQuery'

// ─── Tag types ────────────────────────────────────────────────────────────────

export type AuthApiTagType = 'AuthSession' | 'AuthUser'

// ─── Static mock user ─────────────────────────────────────────────────────────
//
// BOILERPLATE PLACEHOLDER — remove this block when connecting a real API.
//
// This mock lets the role-based routing flow work end-to-end without a backend.
// To switch roles during development, change `role` to any AppRole value:
//   AppRole.ADMIN | AppRole.MANAGER | AppRole.USER | AppRole.SUPER_ADMIN
//
// When your real API is ready:
//   1. Delete MOCK_USER entirely
//   2. Update transformResponse in each endpoint to match your actual response shape
//   3. If your login endpoint returns the user + tokens in a wrapper like
//      { data: { ... }, message: '...', status: 200 } — use ApiResponse<LoginResponse>
//      If it returns a flat object — map it directly to LoginResponse
//   4. Remove the static mock from onQueryStarted in the login endpoint

const MOCK_USER: LoginResponse = {
  id: 1,
  username: 'dev.user',
  email: 'dev@example.com',
  firstName: 'Dev',
  lastName: 'User',
  gender: 'male',
  image: '',
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  refreshTokenExpiryTime: new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString(),
  role: AppRole.ADMIN,
}

// ─── API slice ────────────────────────────────────────────────────────────────

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),

  tagTypes: ['AuthSession', 'AuthUser'] satisfies AuthApiTagType[],

  keepUnusedDataFor: 60,

  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    // ── login ────────────────────────────────────────────────────────────────
    //
    // REAL API: replace transformResponse to match your backend's login response.
    //
    // Common patterns:
    //   A) Wrapped response  → { data: LoginResponse, message: string, status: number }
    //      transformResponse: (res: ApiResponse<LoginResponse>) => res.data
    //
    //   B) Flat response     → { accessToken, refreshToken, id, username, role, ... }
    //      transformResponse: (res: LoginResponse) => res
    //
    //   C) Role in separate call → fetch /me after login in onQueryStarted (see below)

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (request) => ({
        // REAL API: replace with your login endpoint path
        url: 'auth/login',
        method: 'POST',
        data: request,
        showErrorMessage: true,
        showResultMessage: false,
      }),

      // BOILERPLATE: returns the static mock regardless of credentials.
      // REAL API: replace with your actual transformResponse — see patterns above.
      transformResponse: (_raw: unknown): LoginResponse => MOCK_USER,

      transformErrorResponse: (response) => response,

      invalidatesTags: ['AuthSession'],

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled

          // Persist to sessionStorage so the axios interceptor can attach the
          // token on page reload before redux-persist rehydrates.
          setSessionStorage('authData', data)

          const { setUserLoginData } = await import('../Feature/auth.slice')
          dispatch(setUserLoginData(data))
        } catch {
          // Error already handled by baseQuery — no double-toast needed.
        }
      },
    }),

    // ── logout ───────────────────────────────────────────────────────────────
    //
    // REAL API: update the url to your logout endpoint.
    // If your API doesn't have a logout endpoint, remove the query and just
    // clear state in onQueryStarted (the optimistic path already does this).

    logout: builder.mutation<undefined, { refreshToken: string }>({
      query: (request) => ({
        // REAL API: replace with your logout endpoint path
        url: 'auth/logout',
        method: 'POST',
        data: request,
        showErrorMessage: false,
      }),

      transformResponse: () => undefined,

      invalidatesTags: ['AuthSession', 'AuthUser'],

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        // Optimistic logout: clear local state immediately, don't wait for server.
        // If the server call fails, the user is still logged out locally.
        const { clearAuthState, resetStore } = await import(
          '../Feature/auth.slice'
        )
        dispatch(clearAuthState())
        dispatch(resetStore())
        removeSessionStorage('authData')

        try {
          await queryFulfilled
        } catch {
          // Server-side logout failed — local state already cleared, that's fine.
        }
      },
    }),

    // ── getProfile ───────────────────────────────────────────────────────────
    //
    // REAL API: update url and transformResponse to match your /me endpoint.
    // If your API returns a wrapped response: (res: ApiResponse<AuthUser>) => res.data
    // If your API returns a flat user object:  (res: AuthUser) => res

    getProfile: builder.query<AuthUser, undefined>({
      query: () => ({
        // REAL API: replace with your profile endpoint path
        url: 'auth/me',
        method: 'GET',
        showErrorMessage: true,
      }),

      // BOILERPLATE: returns the mock user's profile fields.
      // REAL API: replace with your actual transformResponse — see patterns above.
      transformResponse: (_raw: unknown): AuthUser => ({
        id: MOCK_USER.id,
        username: MOCK_USER.username,
        email: MOCK_USER.email,
        firstName: MOCK_USER.firstName,
        lastName: MOCK_USER.lastName,
        gender: MOCK_USER.gender,
        image: MOCK_USER.image,
        role: MOCK_USER.role,
      }),

      providesTags: (result) =>
        result
          ? [
              { type: 'AuthUser', id: result.id },
              { type: 'AuthUser', id: 'ME' },
              'AuthSession',
            ]
          : ['AuthSession'],

      keepUnusedDataFor: 300,
    }),

    // ── updateProfile ────────────────────────────────────────────────────────
    //
    // REAL API: update url and transformResponse to match your update endpoint.
    // Typical pattern: (res: ApiResponse<AuthUser>) => res.data

    updateProfile: builder.mutation<
      AuthUser,
      Partial<AuthUser> & { id: number }
    >({
      query: ({ id, ...patch }) => ({
        // REAL API: replace with your update profile endpoint path
        url: `users/${String(id)}`,
        method: 'PATCH',
        data: patch,
        showResultMessage: true,
        showErrorMessage: true,
      }),

      // REAL API: replace with your actual transformResponse
      transformResponse: (response: ApiResponse<AuthUser>) => response.data,

      invalidatesTags: (result, _error, arg) =>
        result
          ? [
              { type: 'AuthUser', id: arg.id },
              { type: 'AuthUser', id: 'ME' },
            ]
          : [],

      async onQueryStarted(
        { id: _id, ...patch },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          authApi.util.updateQueryData('getProfile', undefined, (draft) => {
            Object.assign(draft, patch)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLazyGetProfileQuery,
} = authApi

// ─── Selector utilities ───────────────────────────────────────────────────────

export const selectProfileResult =
  authApi.endpoints.getProfile.select(undefined)

export default authApi
