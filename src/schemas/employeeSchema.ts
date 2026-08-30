import { z } from 'zod'

const requiredText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`)

export const employeeSchema = z.object({
  name: requiredText('Name', 2, 50).regex(
    /^[A-Za-z][A-Za-z .'-]*$/,
    'Name can include letters, spaces, hyphens, and apostrophes.',
  ),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .max(100, 'Email must be 100 characters or fewer.')
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      'Enter a valid email address.',
    ),
  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required.')
    .regex(
      /^\d{10,15}$/,
      'Mobile number must be 10 to 15 digits with no spaces or symbols.',
    ),
  country: z.string().trim().min(1, 'Country is required.'),
  state: requiredText('State', 2, 50),
  district: requiredText('District', 2, 50),
  avatar: z.string().optional(),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>
