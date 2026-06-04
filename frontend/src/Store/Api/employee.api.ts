import { createApi } from '@reduxjs/toolkit/query/react'

import type { ApiResponse } from '@project/Types/Api'
import type {
  DashboardStats,
  Employee,
} from '@project/Types/Features/employee'

import axiosBaseQuery from './baseQuery'

export type EmployeeApiTagType = 'Employees' | 'DashboardStats'

const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: axiosBaseQuery(),

  tagTypes: ['Employees', 'DashboardStats'] satisfies EmployeeApiTagType[],

  keepUnusedDataFor: 120,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: false,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], undefined>({
      query: () => ({
        url: 'api/employees',
        method: 'GET',
        showErrorMessage: true,
      }),

      transformResponse: (
        response: ApiResponse<Employee[]>
      ): Employee[] => response.data,

      providesTags: ['Employees'],
    }),

    getDashboardStats: builder.query<DashboardStats, undefined>({
      query: () => ({
        url: 'api/dashboard/stats',
        method: 'GET',
        showErrorMessage: true,
      }),

      transformResponse: (
        response: ApiResponse<DashboardStats>
      ): DashboardStats => response.data,

      providesTags: ['DashboardStats'],
    }),

    updateEmployee: builder.mutation<undefined, { id: number; data: Record<string, string> }>({
      query: ({ id, data }) => ({
        url: `api/employees/${id}`,
        method: 'PUT',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),

      transformResponse: () => undefined,

      invalidatesTags: ['Employees', 'DashboardStats'],
    }),

    createEmployee: builder.mutation<undefined, FormData>({
      query: (formData) => ({
        url: 'api/employees',
        method: 'POST',
        data: formData,
        showErrorMessage: true,
        showResultMessage: true,
      }),

      transformResponse: () => undefined,

      invalidatesTags: ['Employees', 'DashboardStats'],
    }),

    uploadEmployeePhoto: builder.mutation<undefined, { id: number; photo: File }>({
      query: ({ id, photo }) => {
        const fd = new FormData()
        fd.append('photo', photo)
        return {
          url: `api/employees/${id}/photo`,
          method: 'PUT',
          data: fd,
          showErrorMessage: true,
          showResultMessage: true,
        }
      },

      transformResponse: () => undefined,

      invalidatesTags: ['Employees', 'DashboardStats'],
    }),
  }),
})

export const {
  useGetEmployeesQuery,
  useGetDashboardStatsQuery,
  useUpdateEmployeeMutation,
  useCreateEmployeeMutation,
  useUploadEmployeePhotoMutation,
} = employeeApi

export default employeeApi
