import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  employeeSchema,
  type EmployeeFormValues,
} from '../../../schemas/employeeSchema'
import type { Country } from '../../countries/types'
import type { Employee } from '../types'
import { getCountryOptions } from '../utils/countryOptions'
import { getEmployeeFormValues } from '../utils/employeeForm'
import { isImageSrc } from '../utils/isImageSrc'

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
const MAX_IMAGE_BYTES = 500 * 1024

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
  const [photoError, setPhotoError] = useState<string | undefined>()
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

  function applyPhotoFile(
    file: File | undefined,
    onAvatarChange: (value: string) => void,
  ) {
    if (!file) {
      return
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setPhotoError('Choose a JPG, PNG, WEBP, or GIF image.')
      return
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setPhotoError('This image is too large. Choose a photo smaller than 500 KB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onAvatarChange(reader.result)
        setPhotoError(undefined)
      }
    }
    reader.onerror = () => {
      setPhotoError('Unable to read that image. Try another file.')
    }
    reader.readAsDataURL(file)
  }

  function handleClose() {
    setPhotoError(undefined)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : handleClose}
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
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => {
                const photoPreview = isImageSrc(field.value)
                  ? field.value
                  : undefined

                return (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={photoPreview}
                alt=""
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  border: '1px solid',
                  borderColor: 'primary.light',
                  fontSize: '1.75rem',
                }}
              >
                {(employee?.name || '?').trim().charAt(0) || '?'}
              </Avatar>
              <Stack spacing={1} alignItems="flex-start">
                <Typography variant="body2" color="text.secondary">
                  Photo (optional)
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    disabled={isSubmitting}
                  >
                    {photoPreview ? 'Change photo' : 'Upload photo'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      hidden
                      aria-label="Upload employee photo"
                      onChange={(event) => {
                        applyPhotoFile(event.target.files?.[0], field.onChange)
                        event.target.value = ''
                      }}
                    />
                  </Button>
                  {photoPreview ? (
                    <Button
                      type="button"
                      size="small"
                      disabled={isSubmitting}
                      onClick={() => {
                        field.onChange('')
                        setPhotoError(undefined)
                      }}
                    >
                      Remove
                    </Button>
                  ) : null}
                </Stack>
                {photoError ? (
                  <Typography variant="caption" color="error">
                    {photoError}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    JPG, PNG, WEBP, or GIF. Max 500 KB.
                  </Typography>
                )}
              </Stack>
            </Stack>
                )
              }}
            />
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
          <Button type="button" onClick={handleClose} disabled={isSubmitting}>
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
