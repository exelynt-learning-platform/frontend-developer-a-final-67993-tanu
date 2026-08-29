import { useState, type FormEvent } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

interface EmployeeSearchProps {
  onSearch: (employeeId: string) => void
  onClear: () => void
  isSearching?: boolean
}

export function EmployeeSearch({
  onSearch,
  onClear,
  isSearching = false,
}: EmployeeSearchProps) {
  const [employeeId, setEmployeeId] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedId = employeeId.trim()

    if (!trimmedId) {
      return
    }

    onSearch(trimmedId)
  }

  function handleClear() {
    setEmployeeId('')
    onClear()
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 1.5,
        mb: 3,
      }}
    >
      <TextField
        label="Search by employee ID"
        value={employeeId}
        onChange={(event) => setEmployeeId(event.target.value)}
        size="small"
        fullWidth
        autoComplete="off"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isSearching || employeeId.trim().length === 0}
      >
        Search
      </Button>
      <Button
        type="button"
        variant="outlined"
        onClick={handleClear}
        disabled={isSearching}
      >
        Clear
      </Button>
    </Box>
  )
}
