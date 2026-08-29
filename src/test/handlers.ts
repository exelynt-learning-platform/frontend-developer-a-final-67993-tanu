import { http, HttpResponse } from 'msw'
import { mockEmployees } from './fixtures/employees'

export const employeesPath = '*/employee'
export const employeeByIdPath = '*/employee/:id'

export const handlers = [
  http.get(employeeByIdPath, ({ params }) => {
    const employee = mockEmployees.find((item) => item.id === String(params.id))

    if (!employee) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(employee)
  }),
  http.get(employeesPath, () => HttpResponse.json(mockEmployees)),
]
