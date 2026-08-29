import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './baseApi'
import { employeesUiReducer } from '../features/employees/employeeSlice'

import '../features/employees/api/employeeApi'
import '../features/countries/api/countryApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    employeesUi: employeesUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
