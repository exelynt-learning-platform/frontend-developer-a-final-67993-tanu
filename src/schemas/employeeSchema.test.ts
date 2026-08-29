import { employeeSchema } from './employeeSchema'

const validEmployee = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  mobile: '9876543210',
  country: 'India',
  state: 'Maharashtra',
  district: 'Pune',
}

describe('employeeSchema', () => {
  it('accepts valid create and edit values', () => {
    expect(employeeSchema.safeParse(validEmployee).success).toBe(true)
  })

  it('rejects empty required fields', () => {
    const result = employeeSchema.safeParse({
      name: ' ',
      email: '',
      mobile: '',
      country: '',
      state: '',
      district: '',
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message)
      expect(messages).toContain('Name is required.')
      expect(messages).toContain('Email is required.')
      expect(messages).toContain('Mobile number is required.')
      expect(messages).toContain('Country is required.')
      expect(messages).toContain('State is required.')
      expect(messages).toContain('District is required.')
    }
  })

  it('rejects invalid email, mobile, and name formats', () => {
    expect(
      employeeSchema.safeParse({
        ...validEmployee,
        email: 'not-an-email',
      }).success,
    ).toBe(false)
    expect(
      employeeSchema.safeParse({
        ...validEmployee,
        mobile: '12345',
      }).success,
    ).toBe(false)
    expect(
      employeeSchema.safeParse({
        ...validEmployee,
        name: 'Ada123',
      }).success,
    ).toBe(false)
  })
})
