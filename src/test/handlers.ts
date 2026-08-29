import { http, HttpResponse } from 'msw'
import { mockEmployees } from './fixtures/employees'

export const employeesPath = '*/employee'

export const handlers = [
  http.get(employeesPath, () => HttpResponse.json(mockEmployees)),
]
