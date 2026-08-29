import { useMemo } from 'react'
import { EmptyState } from '../../../components/common/EmptyState'
import { ErrorState } from '../../../components/common/ErrorState'
import { LoadingState } from '../../../components/common/LoadingState'
import { PageHeader } from '../../../components/common/PageHeader'
import { getErrorMessage } from '../../../utils/getErrorMessage'
import { useGetEmployeesQuery } from '../api/employeeApi'
import { EmployeeList } from '../components/EmployeeList'
import { fillMissingEmployeeList } from '../utils/fillMissingEmployeeFields'

export function EmployeeManagementContainer() {
  const { data, error, isError, isLoading, refetch } = useGetEmployeesQuery()
  const employees = useMemo(
    () => (data ? fillMissingEmployeeList(data) : data),
    [data],
  )

  let content = (
    <EmptyState
      title="No employees found"
      description="There are no employees to display yet."
    />
  )

  if (isLoading) {
    content = <LoadingState label="Loading employees..." />
  } else if (isError) {
    content = (
      <ErrorState
        message={getErrorMessage(error, 'Unable to load employees.')}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  } else if (employees && employees.length > 0) {
    content = <EmployeeList employees={employees} />
  }

  return (
    <>
      <PageHeader
        title="Employee Management"
        description="View and manage employee records."
      />
      {content}
    </>
  )
}
