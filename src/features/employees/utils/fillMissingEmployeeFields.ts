import type { Employee } from '../types'

const DEPARTMENTS = [
  'IT',
  'Engineering',
  'Human Resources',
  'Finance',
  'Sales',
  'Operations',
  'Marketing',
  'Customer Support',
] as const

const COUNTRY_ID_BY_NAME: Record<string, string> = {
  aruba: '1',
  singapore: '2',
  ecuador: '17',
  india: '32',
  uzbekistan: '15',
  somalia: '10',
  'virgin islands, british': '8',
  azerbaijan: '11',
  'united kingdom': '14',
  colombia: '39',
  germany: '40',
  norway: '29',
  thailand: '30',
  pakistan: '48',
  egypt: '45',
  italy: '43',
}

function stableIndex(value: string, size: number) {
  let hash = 0

  for (const character of value) {
    hash = (hash + character.charCodeAt(0)) % size
  }

  return hash
}

function getMockDepartment(employeeId: string) {
  const numericId = Number.parseInt(employeeId, 10)
  const index = Number.isNaN(numericId)
    ? stableIndex(employeeId, DEPARTMENTS.length)
    : numericId % DEPARTMENTS.length

  return DEPARTMENTS[index]
}

function getMockCountryId(country: string) {
  const normalizedName = country.trim().toLowerCase()

  if (COUNTRY_ID_BY_NAME[normalizedName]) {
    return COUNTRY_ID_BY_NAME[normalizedName]
  }

  return String(stableIndex(normalizedName || 'unknown', 59) + 1)
}

export function fillMissingEmployeeFields(employee: Employee): Employee {
  return {
    ...employee,
    countryId: employee.countryId?.trim() || getMockCountryId(employee.country),
    department:
      employee.department?.trim() || getMockDepartment(employee.id),
  }
}

export function fillMissingEmployeeList(employees: Employee[]): Employee[] {
  return employees.map(fillMissingEmployeeFields)
}
