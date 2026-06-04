import { createApi } from '@reduxjs/toolkit/query/react'

import type { ApiResponse } from '@project/Types/Api'
import { env } from '@project/Utils/envValidation'

import axiosBaseQuery from './baseQuery'

export interface SheetRecord {
  [key: string]: string | null
}

const sheetApi = createApi({
  reducerPath: 'sheetApi',
  baseQuery: axiosBaseQuery(),

  tagTypes: [
    `Sheet_${env.VITE_SHEET_WISHES_TAB}`,
    `Sheet_${env.VITE_SHEET_DEPARTMENTS_TAB}`,
    `Sheet_${env.VITE_SHEET_DESIGNATIONS_TAB}`,
  ],

  keepUnusedDataFor: 120,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: false,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    getSheetRecords: builder.query<SheetRecord[], string>({
      query: (tab) => ({ url: `sheet/${tab}`, method: 'GET', showErrorMessage: true }),
      transformResponse: (response: ApiResponse<SheetRecord[]>): SheetRecord[] =>
        response.data,
      providesTags: (_result, _error, tab) => [{ type: `Sheet_${tab}` as const }],
    }),

    createSheetRecord: builder.mutation<undefined, { tab: string; data: Record<string, string> }>({
      query: ({ tab, data }) => ({
        url: `sheet/${tab}`,
        method: 'POST',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      transformResponse: () => undefined,
      invalidatesTags: (_result, _error, { tab }) => [{ type: `Sheet_${tab}` as const }],
    }),

    updateSheetRecord: builder.mutation<undefined, { tab: string; row: number; data: Record<string, string> }>({
      query: ({ tab, row, data }) => ({
        url: `sheet/${tab}/${row}`,
        method: 'PUT',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      transformResponse: () => undefined,
      invalidatesTags: (_result, _error, { tab }) => [{ type: `Sheet_${tab}` as const }],
    }),

    deleteSheetRecord: builder.mutation<undefined, { tab: string; row: number }>({
      query: ({ tab, row }) => ({
        url: `sheet/${tab}/${row}`,
        method: 'DELETE',
        showErrorMessage: true,
        showResultMessage: true,
      }),
      transformResponse: () => undefined,
      invalidatesTags: (_result, _error, { tab }) => [{ type: `Sheet_${tab}` as const }],
    }),
  }),
})

export const {
  useGetSheetRecordsQuery,
  useCreateSheetRecordMutation,
  useUpdateSheetRecordMutation,
  useDeleteSheetRecordMutation,
} = sheetApi

export default sheetApi
