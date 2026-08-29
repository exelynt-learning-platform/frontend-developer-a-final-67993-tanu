import { baseApi } from '../../../app/baseApi'
import type { Employee, EmployeeWritePayload } from '../types'

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => '/employee',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Employee' as const, id })),
              { type: 'Employee', id: 'LIST' },
            ]
          : [{ type: 'Employee', id: 'LIST' }],
    }),
    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `/employee/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Employee', id }],
    }),
    createEmployee: builder.mutation<Employee, EmployeeWritePayload>({
      query: (body) => ({
        url: '/employee',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }],
    }),
    updateEmployee: builder.mutation<
      Employee,
      { id: string; body: EmployeeWritePayload }
    >({
      query: ({ id, body }) => ({
        url: `/employee/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
      ],
    }),
    deleteEmployee: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/employee/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useLazyGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi
