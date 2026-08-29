import { screen } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { employeesPath } from '../../../test/handlers'
import { server } from '../../../test/server'
import { EmployeeManagementContainer } from './EmployeeManagementContainer'

describe('EmployeeManagementContainer listing', () => {
  it('shows a loading state while employees are being fetched', async () => {
    server.use(
      http.get(employeesPath, async () => {
        await delay(500)
        return HttpResponse.json([])
      }),
    )

    renderWithProviders(<EmployeeManagementContainer />)

    expect(await screen.findByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/loading employees/i)).toBeInTheDocument()
  })

  it('renders employees when the request succeeds', async () => {
    renderWithProviders(<EmployeeManagementContainer />)

    expect(await screen.findAllByText('Gauri Kotwal')).not.toHaveLength(0)
    expect(screen.getAllByText('Radhika').length).toBeGreaterThan(0)
    expect(screen.getAllByText('gaurikotwal@yopmail.com').length).toBeGreaterThan(
      0,
    )
    expect(screen.getAllByText('IT').length).toBeGreaterThan(0)
    expect(screen.queryByText('Ecuador')).not.toBeInTheDocument()
  })

  it('shows an empty state when there are no employees', async () => {
    server.use(http.get(employeesPath, () => HttpResponse.json([])))

    renderWithProviders(<EmployeeManagementContainer />)

    expect(
      await screen.findByText(/no employees found/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/there are no employees to display yet/i),
    ).toBeInTheDocument()
  })

  it('shows an error state when the employees request fails', async () => {
    server.use(
      http.get(employeesPath, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderWithProviders(<EmployeeManagementContainer />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/unable to load employees/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
})
