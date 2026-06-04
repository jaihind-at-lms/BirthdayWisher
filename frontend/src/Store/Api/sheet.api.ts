import { createApi } from '@reduxjs/toolkit/query/react'

import type { ApiResponse } from '@project/Types/Api'

import axiosBaseQuery from './baseQuery'

export interface SheetRecord {
  [key: string]: string | null
}

const sheetApi = createApi({
  reducerPath: 'sheetApi',
  baseQuery: axiosBaseQuery(),

  tagTypes: ['Sheet_wishes', 'Sheet_departments', 'Sheet_designations'],

  keepUnusedDataFor: 120,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: false,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    getSheetRecords: builder.query<SheetRecord[], string>({
      query: (tab) => ({ url: `${tab}`, method: 'GET', showErrorMessage: true }),
      transformResponse: (response: ApiResponse<SheetRecord[]>): SheetRecord[] =>
        response.data,
      providesTags: (_result, _error, tab) => [{ type: `Sheet_${tab}` as const }],
    }),

    createSheetRecord: builder.mutation<undefined, { tab: string; data: Record<string, string> }>({
      query: ({ tab, data }) => ({
        url: `${tab}`,
        method: 'POST',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      transformResponse: () => undefined,
      invalidatesTags: (_result, _error, { tab }) => [{ type: `Sheet_${tab}` as const }],
    }),

    updateSheetRecord: builder.mutation<undefined, { tab: string; id: number; data: Record<string, string> }>({
      query: ({ tab, id, data }) => ({
        url: `${tab}/${id}`,
        method: 'PUT',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      transformResponse: () => undefined,
      invalidatesTags: (_result, _error, { tab }) => [{ type: `Sheet_${tab}` as const }],
    }),

    deleteSheetRecord: builder.mutation<undefined, { tab: string; id: number }>({
      query: ({ tab, id }) => ({
        url: `${tab}/${id}`,
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
