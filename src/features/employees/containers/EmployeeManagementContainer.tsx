import Paper from '@mui/material/Paper'
import { EmptyState } from '../../../components/common/EmptyState'
import { PageHeader } from '../../../components/common/PageHeader'

export function EmployeeManagementContainer() {
  return (
    <>
      <PageHeader
        title="Employee Management"
        description="View, search, and manage employee records."
      />
      <Paper sx={{ px: 2, py: 1 }}>
        <EmptyState
          title="Employee list coming next"
          description="The Redux store, RTK Query APIs, and layout are in place. Listing, search, and forms will be added in the next phases."
        />
      </Paper>
    </>
  )
}
