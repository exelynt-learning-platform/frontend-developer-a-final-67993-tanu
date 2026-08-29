import {
  closeForm,
  employeesUiReducer,
  openCreateForm,
  openEditForm,
} from './employeeSlice'
import type { Employee } from './types'

const employee: Employee = {
  id: '434',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  mobile: '9876543210',
  country: 'india',
  state: 'Maharashtra',
  district: 'Pune',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('employeesUiSlice', () => {
  it('opens the create form and clears the selected employee', () => {
    const state = employeesUiReducer(
      {
        formMode: 'edit',
        selectedEmployee: employee,
        feedbackMessage: null,
      },
      openCreateForm(),
    )

    expect(state.formMode).toBe('create')
    expect(state.selectedEmployee).toBeNull()
  })

  it('opens the edit form with the selected employee', () => {
    const state = employeesUiReducer(undefined, openEditForm(employee))

    expect(state.formMode).toBe('edit')
    expect(state.selectedEmployee).toEqual(employee)
  })

  it('closes the form', () => {
    const state = employeesUiReducer(
      {
        formMode: 'create',
        selectedEmployee: null,
        feedbackMessage: null,
      },
      closeForm(),
    )

    expect(state.formMode).toBe('closed')
  })
})
