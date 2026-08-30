import { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { IntroPage } from './components/intro/IntroPage'
import { AppShell } from './components/layout/AppShell'
import { EmployeeManagementContainer } from './features/employees/containers/EmployeeManagementContainer'

function App() {
  const [view, setView] = useState<'intro' | 'manage'>('intro')

  if (view === 'intro') {
    return <IntroPage onManage={() => setView('manage')} />
  }

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Button
          type="button"
          startIcon={<ArrowBackIcon />}
          onClick={() => setView('intro')}
          sx={{ mb: 2.5, color: 'text.secondary' }}
        >
          Home
        </Button>
        <EmployeeManagementContainer />
      </Container>
    </AppShell>
  )
}

export default App
