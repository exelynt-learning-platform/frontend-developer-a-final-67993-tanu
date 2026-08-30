import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Alert from '@mui/material/Alert'
import type { Employee } from '../types'

interface DeleteEmployeeDialogProps {
  employee: Employee | null
  open: boolean
  isDeleting?: boolean
  error?: string
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteEmployeeDialog({
  employee,
  open,
  isDeleting = false,
  error,
  onCancel,
  onConfirm,
}: DeleteEmployeeDialogProps) {
  const name = employee?.name.trim() || 'this employee'

  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onCancel}
      aria-labelledby="delete-employee-title"
      aria-describedby="delete-employee-description"
    >
      <DialogTitle id="delete-employee-title">Delete employee?</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText id="delete-employee-description">
          This will permanently remove {name}
          {employee?.id ? ` (ID ${employee.id})` : ''}. This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button type="button" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          type="button"
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={isDeleting || !employee}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
