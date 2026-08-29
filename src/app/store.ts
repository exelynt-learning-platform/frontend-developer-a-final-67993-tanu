import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './baseApi'
import { employeesUiReducer } from '../features/employees/employeeSlice'

import '../features/employees/api/employeeApi'
import '../features/countries/api/countryApi'

export function setupStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      employeesUi: employeesUiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  })
}

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
