import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {
  employeeSchema,
  type EmployeeFormValues,
} from '../../../schemas/employeeSchema'
import type { Country } from '../../countries/types'
import type { Employee } from '../types'
import { getCountryOptions } from '../utils/countryOptions'
import { getEmployeeFormValues } from '../utils/employeeForm'

interface EmployeeFormProps {
  open: boolean
  mode: 'create' | 'edit'
  employee?: Employee | null
  countries: Country[]
  countriesError?: string
  isCountriesLoading?: boolean
  isSubmitting?: boolean
  submitError?: string
  onClose: () => void
  onSubmit: (values: EmployeeFormValues) => Promise<void> | void
}

export function EmployeeForm({
  open,
  mode,
  employee,
  countries,
  countriesError,
  isCountriesLoading = false,
  isSubmitting = false,
  submitError,
  onClose,
  onSubmit,
}: EmployeeFormProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: getEmployeeFormValues(employee),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const countryOptions = getCountryOptions(countries, employee?.country)

  useEffect(() => {
    if (open) {
      reset(getEmployeeFormValues(employee))
    }
  }, [employee, open, reset])

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="employee-form-title"
    >
      <DialogTitle id="employee-form-title">
        {mode === 'create' ? 'Add employee' : 'Edit employee'}
      </DialogTitle>
      <form
        id="employee-form"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSubmit(onSubmit)(event)
        }}
        noValidate
      >
        <DialogContent sx={{ overflow: 'visible' }}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {submitError ? <Alert severity="error">{submitError}</Alert> : null}
            {countriesError ? (
              <Alert severity="error">{countriesError}</Alert>
            ) : null}
            <TextField
              label="Name"
              autoComplete="name"
              required
              disabled={isSubmitting}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 50 } }}
              {...register('name')}
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 100 } }}
              {...register('email')}
            />
            <TextField
              label="Mobile"
              autoComplete="tel"
              required
              disabled={isSubmitting}
              error={Boolean(errors.mobile)}
              helperText={errors.mobile?.message}
              fullWidth
              slotProps={{
                htmlInput: { inputMode: 'numeric', maxLength: 15 },
              }}
              {...register('mobile')}
            />
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Country"
                  required
                  fullWidth
                  disabled={isSubmitting || isCountriesLoading}
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country?.message ??
                    (isCountriesLoading ? 'Loading countries...' : undefined)
                  }
                >
                  {countryOptions.map((option) => (
                    <MenuItem key={option.id || option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              label="State"
              required
              disabled={isSubmitting}
              error={Boolean(errors.state)}
              helperText={errors.state?.message}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 50 } }}
              {...register('state')}
            />
            <TextField
              label="District"
              required
              disabled={isSubmitting}
              error={Boolean(errors.district)}
              helperText={errors.district?.message}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 50 } }}
              {...register('district')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="employee-form"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : mode === 'create'
                ? 'Create employee'
                : 'Save changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
