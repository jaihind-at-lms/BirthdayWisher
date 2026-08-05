import { createApi } from '@reduxjs/toolkit/query/react'

import type { ApiResponse } from '@project/Types/Api'
import type { Template } from '@project/Types/Features/template'

import axiosBaseQuery from './baseQuery'

export type TemplateApiTagType = 'Templates'

const templateApi = createApi({
  reducerPath: 'templateApi',
  baseQuery: axiosBaseQuery(),

  tagTypes: ['Templates'] satisfies TemplateApiTagType[],

  keepUnusedDataFor: 120,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: false,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    getTemplates: builder.query<Template[], undefined>({
      query: () => ({
        url: 'api/templates',
        method: 'GET',
        showErrorMessage: true,
      }),
      transformResponse: (response: ApiResponse<Template[]>): Template[] =>
        response.data,
      providesTags: ['Templates'],
    }),

    getTemplate: builder.query<Template, number>({
      query: (id) => ({
        url: `api/templates/${id}`,
        method: 'GET',
        showErrorMessage: true,
      }),
      transformResponse: (response: ApiResponse<Template>): Template =>
        response.data,
      providesTags: ['Templates'],
    }),

    createTemplate: builder.mutation<Template, FormData>({
      query: (formData) => ({
        url: 'api/templates',
        method: 'POST',
        data: formData,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      transformResponse: (response: ApiResponse<Template>): Template =>
        response.data,
      invalidatesTags: ['Templates'],
    }),

    updateTemplate: builder.mutation<Template, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `api/templates/${id}`,
        method: 'PUT',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      transformResponse: (response: ApiResponse<Template>): Template =>
        response.data,
      invalidatesTags: ['Templates'],
    }),

    deleteTemplate: builder.mutation<undefined, number>({
      query: (id) => ({
        url: `api/templates/${id}`,
        method: 'DELETE',
        showErrorMessage: true,
        showResultMessage: true,
      }),
      transformResponse: () => undefined,
      invalidatesTags: ['Templates'],
    }),

    previewTemplate: builder.mutation<string, { id: number; data: FormData }>({
      queryFn: async ({ id, data }) => {
        try {
          const { apiClient } = await import('./baseQuery')
          const response = await apiClient({
            url: `api/templates/${id}/preview`,
            method: 'POST',
            data,
            responseType: 'arraybuffer',
          })
          const blob = new Blob([response.data as ArrayBuffer], { type: 'image/png' })
          const url = URL.createObjectURL(blob)
          return { data: url }
        } catch (error) {
          return { error: { status: 500, message: 'Preview generation failed' } }
        }
      },
    }),
  }),
})

export const {
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  usePreviewTemplateMutation,
} = templateApi

export default templateApi
