import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { EmptyState } from '../../../components/common/EmptyState'
import { ErrorState } from '../../../components/common/ErrorState'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageHeader } from '../../../components/common/PageHeader'
import { getErrorMessage, isNotFoundError } from '../../../utils/getErrorMessage'
import { useGetCountriesQuery } from '../../countries/api/countryApi'
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
  useLazyGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from '../api/employeeApi'
import { EmployeeForm } from '../components/EmployeeForm'
import { DeleteEmployeeDialog } from '../components/DeleteEmployeeDialog'
import { EmployeeList } from '../components/EmployeeList'
import { EmployeeSearch } from '../components/EmployeeSearch'
import {
  closeForm,
  openCreateForm,
  openEditForm,
  selectFeedbackMessage,
  selectFormMode,
  selectSelectedEmployee,
  setFeedbackMessage,
} from '../employeeSlice'
import type { EmployeeFormValues } from '../../../schemas/employeeSchema'
import type { Employee } from '../types'
import { findCountryId, getCountryOptions } from '../utils/countryOptions'
import { toEmployeeWritePayload } from '../utils/employeeForm'

export function EmployeeManagementContainer() {
  const dispatch = useAppDispatch()
  const formMode = useAppSelector(selectFormMode)
  const selectedEmployee = useAppSelector(selectSelectedEmployee)
  const feedbackMessage = useAppSelector(selectFeedbackMessage)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const isFormOpen = formMode !== 'closed'

  const { data: employees, error, isError, isLoading, refetch } =
    useGetEmployeesQuery()
  const {
    data: countries = [],
    error: countriesError,
    isError: isCountriesError,
    isLoading: isCountriesLoading,
  } = useGetCountriesQuery(undefined, { skip: !isFormOpen })
  const [
    searchEmployeeById,
    {
      data: searchedEmployee,
      error: searchError,
      isError: isSearchError,
      isFetching: isSearching,
      reset: resetSearch,
    },
  ] = useLazyGetEmployeeByIdQuery()
  const [createEmployee, createState] = useCreateEmployeeMutation()
  const [updateEmployee, updateState] = useUpdateEmployeeMutation()
  const [deleteEmployee, deleteState] = useDeleteEmployeeMutation()
  const [hasSearched, setHasSearched] = useState(false)
  const searchResult = searchedEmployee

  function handleSearch(employeeId: string) {
    setHasSearched(true)
    void searchEmployeeById(employeeId)
  }

  function handleClearSearch() {
    setHasSearched(false)
    resetSearch()
  }

  async function handleFormSubmit(values: EmployeeFormValues) {
    const countryId = findCountryId(
      getCountryOptions(countries, selectedEmployee?.country),
      values.country,
    )
    const body = toEmployeeWritePayload(
      values,
      countryId,
      selectedEmployee,
    )

    try {
      if (formMode === 'create') {
        await createEmployee(body).unwrap()
        dispatch(setFeedbackMessage('Employee created.'))
      } else if (formMode === 'edit' && selectedEmployee) {
        await updateEmployee({ id: selectedEmployee.id, body }).unwrap()
        dispatch(setFeedbackMessage('Employee updated.'))
      }

      dispatch(closeForm())
      createState.reset()
      updateState.reset()
    } catch {
      // Mutation error is shown in the form via submitError.
    }
  }

  function handleCloseForm() {
    dispatch(closeForm())
    createState.reset()
    updateState.reset()
  }

  async function handleConfirmDelete() {
    if (!employeeToDelete) {
      return
    }

    try {
      await deleteEmployee(employeeToDelete.id).unwrap()
      dispatch(setFeedbackMessage('Employee deleted.'))

      if (searchedEmployee?.id === employeeToDelete.id) {
        handleClearSearch()
      }

      setEmployeeToDelete(null)
      deleteState.reset()
    } catch {
      // Mutation error is shown in the delete dialog.
    }
  }

  function handleCancelDelete() {
    setEmployeeToDelete(null)
    deleteState.reset()
  }

  const isSaving = createState.isLoading || updateState.isLoading
  const submitError = createState.isError
    ? getErrorMessage(createState.error, 'Unable to save employee.')
    : updateState.isError
      ? getErrorMessage(updateState.error, 'Unable to save employee.')
      : undefined
  const deleteError = deleteState.isError
    ? getErrorMessage(deleteState.error, 'Unable to delete employee.')
    : undefined

  let listContent = (
    <EmptyState
      title="No employees found"
      description="There are no employees to display yet."
    />
  )

  if (isLoading) {
    listContent = <LoadingState label="Loading employees..." />
  } else if (isError) {
    listContent = (
      <ErrorState
        message={getErrorMessage(error, 'Unable to load employees.')}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  } else if (employees && employees.length > 0) {
    listContent = (
      <EmployeeList
        employees={employees}
        onEdit={(employee) => dispatch(openEditForm(employee))}
        onDelete={setEmployeeToDelete}
      />
    )
  }

  let searchContent = null

  if (hasSearched && isSearching) {
    searchContent = <LoadingState label="Searching for employee..." />
  } else if (hasSearched && isSearchError && isNotFoundError(searchError)) {
    searchContent = (
      <EmptyState
        title="Employee not found"
        description="No employee exists with that ID."
      />
    )
  } else if (hasSearched && isSearchError) {
    searchContent = (
      <ErrorState
        message={getErrorMessage(searchError, 'Unable to search for that employee.')}
      />
    )
  } else if (hasSearched && searchResult) {
    searchContent = (
      <EmployeeList
        employees={[searchResult]}
        onEdit={(employee) => dispatch(openEditForm(employee))}
        onDelete={setEmployeeToDelete}
      />
    )
  } else if (hasSearched) {
    searchContent = <LoadingState label="Searching for employee..." />
  }

  return (
    <>
      <PageHeader
        title="Employee Management"
        description="View and manage employee records."
        action={
          <Button
            variant="contained"
            startIcon={<PersonAddAltOutlinedIcon />}
            onClick={() => dispatch(openCreateForm())}
          >
            Add Employee
          </Button>
        }
      />
      <EmployeeSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isSearching={isSearching}
      />
      {hasSearched ? searchContent : listContent}
      <EmployeeForm
        open={isFormOpen}
        mode={formMode === 'edit' ? 'edit' : 'create'}
        employee={selectedEmployee}
        countries={countries}
        countriesError={
          isCountriesError
            ? getErrorMessage(countriesError, 'Unable to load countries.')
            : undefined
        }
        isCountriesLoading={isCountriesLoading}
        isSubmitting={isSaving}
        submitError={submitError}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />
      <DeleteEmployeeDialog
        employee={employeeToDelete}
        open={Boolean(employeeToDelete)}
        isDeleting={deleteState.isLoading}
        error={deleteError}
        onCancel={handleCancelDelete}
        onConfirm={() => {
          void handleConfirmDelete()
        }}
      />
      <Snackbar
        open={Boolean(feedbackMessage)}
        autoHideDuration={4000}
        onClose={() => dispatch(setFeedbackMessage(null))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => dispatch(setFeedbackMessage(null))}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
