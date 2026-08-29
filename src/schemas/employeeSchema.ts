import { z } from 'zod'

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(50, 'Name must be 50 characters or fewer.')
    .regex(
      /^[A-Za-z][A-Za-z .'-]*$/,
      'Name can include letters, spaces, hyphens, and apostrophes.',
    ),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .max(100, 'Email must be 100 characters or fewer.')
    .email('Enter a valid email address.'),
  mobile: z
    .string()
    .trim()
    .regex(
      /^\d{10,15}$/,
      'Mobile number must be 10 to 15 digits with no spaces or symbols.',
    ),
  country: z.string().trim().min(1, 'Country is required.'),
  state: z
    .string()
    .trim()
    .min(2, 'State must be at least 2 characters.')
    .max(50, 'State must be 50 characters or fewer.'),
  district: z
    .string()
    .trim()
    .min(2, 'District must be at least 2 characters.')
    .max(50, 'District must be 50 characters or fewer.'),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>
