import { http, HttpResponse } from 'msw'
import { mockCountries } from './fixtures/countries'
import { mockEmployees } from './fixtures/employees'
import type { Employee } from '../features/employees/types'

export const employeesPath = '*/employee'
export const employeeByIdPath = '*/employee/:id'
export const countriesPath = '*/country'

let employees = structuredClone(mockEmployees)

export function resetMockEmployees() {
  employees = structuredClone(mockEmployees)
}

export const handlers = [
  http.get(employeeByIdPath, ({ params }) => {
    const employee = employees.find((item) => item.id === String(params.id))

    if (!employee) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(employee)
  }),
  http.put(employeeByIdPath, async ({ params, request }) => {
    const id = String(params.id)
    const body = (await request.json()) as Partial<Employee>
    const index = employees.findIndex((item) => item.id === id)

    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    employees[index] = {
      ...employees[index],
      ...body,
      id,
    }

    return HttpResponse.json(employees[index])
  }),
  http.delete(employeeByIdPath, ({ params }) => {
    const id = String(params.id)
    const index = employees.findIndex((item) => item.id === id)

    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    employees.splice(index, 1)
    return HttpResponse.json({ id })
  }),
  http.post(employeesPath, async ({ request }) => {
    const body = (await request.json()) as Partial<Employee>
    const created: Employee = {
      id: String(900 + employees.length),
      createdAt: '2026-08-29T00:00:00.000Z',
      name: body.name ?? '',
      mobile: body.mobile ?? '',
      country: body.country ?? '',
      state: body.state ?? '',
      district: body.district ?? '',
      email: body.email,
      emailId: body.emailId,
      avatar: body.avatar,
      countryId: body.countryId,
      department: body.department,
    }

    employees.push(created)
    return HttpResponse.json(created, { status: 201 })
  }),
  http.get(employeesPath, () => HttpResponse.json(employees)),
  http.get(countriesPath, () => HttpResponse.json(mockCountries)),
]
