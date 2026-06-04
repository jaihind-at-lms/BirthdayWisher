import type { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/query'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import dayjs from 'dayjs'

import type { ApiResponse } from '@project/Types/Api'
import type { QueryError } from '@project/Types/Api/queryError'
import type { LoginResponse } from '@project/Types/Features/auth'
import {
  showErrorToast,
  showSuccessToast,
} from '@project/Utils/notificationPopup'

import {
  clearLocalStorage,
  setSessionStorage,
} from '../../Utils/browserStorage'
import { HttpMethod, HttpStatus } from '../../Utils/constant'
import {
  clearAuthState,
  resetStore,
  setAccessToken,
} from '../Feature/auth.slice'
import type { AppStore, RootState } from '../store'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AxiosQueryArgs {
  url: string
  method: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  responseType?: 'blob'
  downloadFileName?: string
  /** Show a success toast on 200/204. Default: false */
  showResultMessage?: boolean
  /** Show an error toast on failure. Default: true */
  showErrorMessage?: boolean
}

/** Strips boilerplate-only fields before passing args to axios */
const toAxiosConfig = (
  args: AxiosQueryArgs,
  overrides?: Partial<AxiosRequestConfig>
): AxiosRequestConfig => {
  const {
    downloadFileName: _d,
    showResultMessage: _s,
    showErrorMessage: _e,
    method,
    ...rest
  } = args
  // Assign method explicitly so exactOptionalPropertyTypes is satisfied
  const config: AxiosRequestConfig = { ...rest, ...overrides }
  if (method !== undefined) config.method = method
  return config
}

// ─── Axios instance ───────────────────────────────────────────────────────────

/**
 * Isolated axios instance — not the global singleton.
 * Keeps interceptors scoped and makes the module testable.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'Access-Control-Expose-Headers':
      'X-Pagination-Current-Page, X-Pagination-Total-Count',
  },
})

// ─── Store accessor (breaks circular dep without require) ─────────────────────

/**
 * Lazily resolved store reference.
 * Initialized by store.ts after the store is created to avoid circular imports.
 */
let _store: AppStore | null = null

export const setStoreRef = (store: AppStore): void => {
  _store = store
}

const getStoreRef = (): AppStore => {
  if (!_store) throw new Error('[baseQuery] Store ref not initialized.')
  return _store
}

// ─── Request interceptor ──────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = getStoreRef().getState()
    const { accessToken } = state.auth
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: unknown) =>
    Promise.reject(error instanceof Error ? error : new Error(String(error)))
)

// ─── Token refresh (with race condition guard) ────────────────────────────────

/** Prevents multiple concurrent refresh calls */
let refreshPromise: Promise<string | null> | null = null

const attemptTokenRefresh = async (
  refreshToken: string,
  accessToken: string,
  api: BaseQueryApi
): Promise<string | null> => {
  try {
    const res = await apiClient({
      // REAL API: replace with your token refresh endpoint path
      url: 'auth/refresh',
      method: HttpMethod.POST,
      data: { refreshToken, accessToken },
    })
    // REAL API: unwrap to match your refresh response shape.
    // Wrapped:  (res.data as ApiResponse<LoginResponse>).data
    // Flat:     res.data as LoginResponse
    const newAuthData = (res.data as ApiResponse<LoginResponse>).data
    if (newAuthData.accessToken) {
      setSessionStorage('authData', newAuthData)
      api.dispatch(setAccessToken(newAuthData.accessToken))
      return newAuthData.accessToken
    }
  } catch {
    // refresh failed — fall through to logout
  }
  return null
}

const handleUnauthorized = (api: BaseQueryApi): Promise<string | null> => {
  // Reuse in-flight refresh if one is already running
  if (refreshPromise) return refreshPromise

  const state = api.getState() as RootState
  const { refreshToken, refreshTokenExpiryTime, accessToken } = state.auth
  if (refreshToken && refreshTokenExpiryTime) {
    const timeDiff = dayjs(refreshTokenExpiryTime).diff(dayjs(), 'second')

    if (timeDiff > 0) {
      refreshPromise = attemptTokenRefresh(
        refreshToken,
        accessToken,
        api
      ).finally(() => {
        refreshPromise = null
      })
      return refreshPromise
    }
  }

  // Refresh token missing or expired — clear session
  api.dispatch(resetStore())
  api.dispatch(clearAuthState())
  clearLocalStorage()
  return Promise.resolve(null)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const triggerBlobDownload = (data: Blob, fileName = 'download.xlsx'): void => {
  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

// ─── HTTP error messages ──────────────────────────────────────────────────────

const HTTP_ERROR_MESSAGES: Partial<Record<number, string>> = {
  [HttpStatus.BAD_REQUEST]: 'Invalid request. Please check your input.',
  [HttpStatus.UNAUTHORIZED]: 'Your session has expired. Please log in again.',
  [HttpStatus.FORBIDDEN]: 'You do not have permission to perform this action.',
  [HttpStatus.NOT_FOUND]: 'The requested resource was not found.',
  [HttpStatus.CONFLICT]: 'A conflict occurred. The resource may already exist.',
  [HttpStatus.UNPROCESSABLE]: 'The submitted data could not be processed.',
  [HttpStatus.TOO_MANY_REQUESTS]:
    'Too many requests. Please slow down and try again.',
  [HttpStatus.INTERNAL_SERVER_ERROR]:
    'A server error occurred. Please try again later.',
  [HttpStatus.BAD_GATEWAY]:
    'Bad gateway. The server received an invalid response.',
  [HttpStatus.SERVICE_UNAVAILABLE]:
    'Service is temporarily unavailable. Please try again later.',
}

const getHttpErrorMessage = (
  status: number | undefined,
  serverMessage?: string
): string => {
  // Prefer the server's own message if it's meaningful
  if (serverMessage && serverMessage.trim().length > 0) return serverMessage
  if (status !== undefined) {
    const msg = HTTP_ERROR_MESSAGES[status]
    if (msg) return msg
  }
  return 'An unexpected error occurred. Please try again.'
}

// ─── Error normalization ──────────────────────────────────────────────────────

const normalizeError = (err: AxiosError<ApiResponse<unknown>>): QueryError => ({
  status: err.response?.status,
  message: err.response?.data.message ?? err.message,
  data: err.response?.data,
  errorCode: err.code,
})

const handleErrorToast = (
  err: AxiosError<ApiResponse<unknown>>,
  showErrorMessage: boolean
): void => {
  if (!showErrorMessage) return

  // Timeout
  if (err.code === 'ECONNABORTED') {
    showErrorToast(
      'Request timed out. Please check your connection and try again.'
    )
    return
  }

  // Network error (no response from server)
  if (!err.response) {
    showErrorToast('No internet connection. Please check your network.')
    return
  }

  const { status, data } = err.response
  // Skip toast for 401 — handled by the refresh/logout flow
  if (status === HttpStatus.UNAUTHORIZED) return

  showErrorToast(getHttpErrorMessage(status, data.message))
}

// ─── Base query ───────────────────────────────────────────────────────────────

const axiosBaseQuery =
  (): BaseQueryFn<AxiosQueryArgs, unknown, QueryError> =>
  async (
    args: AxiosQueryArgs,
    api: BaseQueryApi,
    _extraOptions: Record<string, unknown>
  ) => {
    // Wire AbortController signal through to axios
    const controller = new AbortController()

    try {
      const result = await apiClient(
        toAxiosConfig(args, { signal: controller.signal })
      )

      if (args.responseType === 'blob') {
        triggerBlobDownload(result.data as Blob, args.downloadFileName)
      }

      if (args.showResultMessage) {
        const payload = result.data as ApiResponse<{ message?: string }>
        if (result.status === HttpStatus.OK) {
          showSuccessToast(payload.data.message ?? 'Operation was successful.')
        } else if (result.status === HttpStatus.NO_CONTENT) {
          showSuccessToast('No content found.')
        }
      }

      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError<ApiResponse<unknown>>

      // Cancelled requests — don't show errors
      if (axios.isCancel(axiosError)) {
        return { error: { status: undefined, message: 'Request cancelled.' } }
      }

      if (err.response?.status === HttpStatus.UNAUTHORIZED) {
        const newToken = await handleUnauthorized(api)
        if (newToken) {
          try {
            const retryResult = await apiClient(
              toAxiosConfig(args, {
                headers: { Authorization: `Bearer ${newToken}` },
                signal: controller.signal,
              })
            )
            return { data: retryResult.data }
          } catch (retryError) {
            const retryErr = retryError as AxiosError<ApiResponse<unknown>>
            handleErrorToast(retryErr, args.showErrorMessage !== false)
            return { error: normalizeError(retryErr) }
          }
        }
      }

      handleErrorToast(err, args.showErrorMessage !== false)
      return { error: normalizeError(err) }
    }
  }

export default axiosBaseQuery
