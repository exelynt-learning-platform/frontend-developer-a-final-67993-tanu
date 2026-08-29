import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Employee } from './types'

export type EmployeeFormMode = 'closed' | 'create' | 'edit'

export interface EmployeesUiState {
  formMode: EmployeeFormMode
  selectedEmployee: Employee | null
  feedbackMessage: string | null
}

const initialState: EmployeesUiState = {
  formMode: 'closed',
  selectedEmployee: null,
  feedbackMessage: null,
}

const employeesUiSlice = createSlice({
  name: 'employeesUi',
  initialState,
  reducers: {
    openCreateForm(state) {
      state.formMode = 'create'
      state.selectedEmployee = null
    },
    openEditForm(state, action: PayloadAction<Employee>) {
      state.formMode = 'edit'
      state.selectedEmployee = action.payload
    },
    closeForm(state) {
      state.formMode = 'closed'
      state.selectedEmployee = null
    },
    setFeedbackMessage(state, action: PayloadAction<string | null>) {
      state.feedbackMessage = action.payload
    },
  },
})

export const {
  openCreateForm,
  openEditForm,
  closeForm,
  setFeedbackMessage,
} = employeesUiSlice.actions

export const employeesUiReducer = employeesUiSlice.reducer

export const selectFormMode = (state: RootState) => state.employeesUi.formMode
export const selectSelectedEmployee = (state: RootState) =>
  state.employeesUi.selectedEmployee
export const selectFeedbackMessage = (state: RootState) =>
  state.employeesUi.feedbackMessage
