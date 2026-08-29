import Container from '@mui/material/Container'
import { EmployeeManagementContainer } from './features/employees/containers/EmployeeManagementContainer'

function App() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <EmployeeManagementContainer />
    </Container>
  )
}

export default App
