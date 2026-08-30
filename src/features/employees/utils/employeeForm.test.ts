import { getEmployeeFormValues, toEmployeeWritePayload } from './employeeForm'
import { mockEmployees } from '../../../test/fixtures/employees'

describe('employeeForm helpers', () => {
  it('clears invalid faker mobile values when editing', () => {
    expect(getEmployeeFormValues(mockEmployees[2]).mobile).toBe('')
  })

  it('preserves extra API fields on update', () => {
    const payload = toEmployeeWritePayload(
      {
        name: 'Gauri Kotwal',
        email: 'gaurikotwal@yopmail.com',
        mobile: '8785456879',
        country: 'Ecuador',
        state: 'Maharashtra',
        district: 'Pune',
      },
      '17',
      mockEmployees[0],
    )

    expect(payload).toMatchObject({
      countryId: '17',
      department: 'IT',
      emailId: 'arungovil@yopmail.com',
      avatar: 'ehfbwerywrgu',
    })
  })

  it('sends a newly uploaded image as avatar', () => {
    const payload = toEmployeeWritePayload(
      {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune',
        avatar: 'data:image/png;base64,abc',
      },
      '1',
    )

    expect(payload.avatar).toBe('data:image/png;base64,abc')
  })
})
