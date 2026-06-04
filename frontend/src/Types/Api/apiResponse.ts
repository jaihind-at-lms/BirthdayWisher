import type { HttpStatusCode } from '@project/Utils/constant'

/**
 * Standard API envelope returned by the backend.
 * `data` is the typed payload, everything else is metadata.
 */
export interface ApiResponse<T> {
  data: T
  message: string
  status: HttpStatusCode
  responseMessage: 'FAILED' | 'SUCCESS'
  /** Only present on list/paginated endpoints */
  totalRecords?: number
  noOfRecords?: number
}
