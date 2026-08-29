import { baseApi } from '../../../app/baseApi'
import type { Country } from '../types'

export const countryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => '/country',
      providesTags: ['Country'],
    }),
  }),
})

export const { useGetCountriesQuery } = countryApi
