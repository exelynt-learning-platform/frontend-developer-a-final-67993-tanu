import '@testing-library/jest-dom/vitest'
import { resetMockEmployees } from './handlers'
import { server } from './server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  resetMockEmployees()
})

afterAll(() => {
  server.close()
})
