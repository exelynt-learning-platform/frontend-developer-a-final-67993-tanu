import type { Employee } from '../types'
import { fillMissingEmployeeFields } from './fillMissingEmployeeFields'

const employee: Employee = {
  id: '563',
  name: 'Clint Osinski',
  mobile: 'Invalid faker method - phone.phoneNumberFormat',
  country: "Cote d'Ivoire",
  state: 'Michigan',
  district: 'South Adrian',
  createdAt: '2026-08-28T15:35:29.857Z',
}

describe('fillMissingEmployeeFields', () => {
  it('keeps existing country ID and department from the API', () => {
    const result = fillMissingEmployeeFields({
      ...employee,
      id: '532',
      country: 'Ecuador',
      countryId: '17',
      department: 'IT',
    })

    expect(result.countryId).toBe('17')
    expect(result.department).toBe('IT')
  })

  it('fills missing country ID and department with stable mock values', () => {
    const first = fillMissingEmployeeFields(employee)
    const second = fillMissingEmployeeFields(employee)

    expect(first.countryId).toBeTruthy()
    expect(first.department).toBeTruthy()
    expect(first.countryId).not.toBe('—')
    expect(first.department).not.toBe('—')
    expect(first).toEqual(second)
    expect(first.name).toBe('Clint Osinski')
    expect(first.country).toBe("Cote d'Ivoire")
  })

  it('maps known country names to authentic country IDs', () => {
    const result = fillMissingEmployeeFields({
      ...employee,
      country: 'india',
    })

    expect(result.countryId).toBe('32')
  })
})
