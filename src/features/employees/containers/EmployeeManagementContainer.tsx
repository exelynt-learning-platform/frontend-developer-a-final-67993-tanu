import { useState } from 'react'
import { EmptyState } from '../../../components/common/EmptyState'
import { ErrorState } from '../../../components/common/ErrorState'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageHeader } from '../../../components/common/PageHeader'
import { getErrorMessage, isNotFoundError } from '../../../utils/getErrorMessage'
import {
  useGetEmployeesQuery,
  useLazyGetEmployeeByIdQuery,
} from '../api/employeeApi'
import { EmployeeList } from '../components/EmployeeList'
import { EmployeeSearch } from '../components/EmployeeSearch'
import { fillMissingEmployeeFields, fillMissingEmployeeList } from '../utils/fillMissingEmployeeFields'

export function EmployeeManagementContainer() {
  const { data, error, isError, isLoading, refetch } = useGetEmployeesQuery()
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
  const [hasSearched, setHasSearched] = useState(false)

  const employees = data ? fillMissingEmployeeList(data) : data
  const searchResult = searchedEmployee
    ? fillMissingEmployeeFields(searchedEmployee)
    : undefined

  function handleSearch(employeeId: string) {
    setHasSearched(true)
    void searchEmployeeById(employeeId)
  }

  function handleClearSearch() {
    setHasSearched(false)
    resetSearch()
  }

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
    listContent = <EmployeeList employees={employees} />
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
    searchContent = <EmployeeList employees={[searchResult]} />
  } else if (hasSearched) {
    searchContent = <LoadingState label="Searching for employee..." />
  }

  return (
    <>
      <PageHeader
        title="Employee Management"
        description="View and manage employee records."
      />
      <EmployeeSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isSearching={isSearching}
      />
      {hasSearched ? searchContent : listContent}
    </>
  )
}
