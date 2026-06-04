import { createApi } from '@reduxjs/toolkit/query/react'

import type { ApiResponse } from '@project/Types/Api'
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from '@project/Types/Features/auth'
import {
  removeSessionStorage,
  setSessionStorage,
} from '@project/Utils/browserStorage'

import axiosBaseQuery from './baseQuery'

export type AuthApiTagType = 'AuthSession' | 'AuthUser'

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),

  tagTypes: ['AuthSession', 'AuthUser'] satisfies AuthApiTagType[],

  keepUnusedDataFor: 60,

  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (request) => ({
        url: 'api/auth/login',
        method: 'POST',
        data: request,
        showErrorMessage: true,
        showResultMessage: false,
      }),

      transformResponse: (response: ApiResponse<LoginResponse>): LoginResponse =>
        response.data,

      invalidatesTags: ['AuthSession'],

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled

          setSessionStorage('authData', data)

          const { setUserLoginData } = await import('../Feature/auth.slice')
          dispatch(setUserLoginData(data))
        } catch {
          // handled by baseQuery toast
        }
      },
    }),

    logout: builder.mutation<undefined, { refreshToken: string }>({
      query: (request) => ({
        url: 'api/auth/logout',
        method: 'POST',
        data: request,
        showErrorMessage: false,
      }),

      transformResponse: () => undefined,

      invalidatesTags: ['AuthSession', 'AuthUser'],

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        const { clearAuthState, resetStore } = await import(
          '../Feature/auth.slice'
        )
        dispatch(clearAuthState())
        dispatch(resetStore())
        removeSessionStorage('authData')

        try {
          await queryFulfilled
        } catch {
          // local state already cleared
        }
      },
    }),

    getProfile: builder.query<AuthUser, undefined>({
      query: () => ({
        url: 'api/auth/me',
        method: 'GET',
        showErrorMessage: true,
      }),

      transformResponse: (response: ApiResponse<AuthUser>): AuthUser =>
        response.data,

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
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
} = authApi

export const selectProfileResult =
  authApi.endpoints.getProfile.select(undefined)

export default authApi
