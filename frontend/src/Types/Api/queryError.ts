/**
 * Normalized error shape returned by axiosBaseQuery.
 * All RTK Query error handling should use this type.
 */
export interface QueryError {
  /** HTTP status code, or undefined for network/cancel errors */
  status: number | undefined
  message: string
  data?: unknown
  /**
   * Axios error code for non-HTTP errors.
   * e.g. 'ERR_NETWORK' | 'ECONNABORTED' | 'ERR_CANCELED'
   */
  errorCode?: string | undefined
}
