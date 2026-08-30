import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { employeeByIdPath, employeesPath, countriesPath } from '../../../test/handlers'
import { mockCountries } from '../../../test/fixtures/countries'
import { mockEmployees } from '../../../test/fixtures/employees'
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
    expect(screen.getAllByText('Ecuador').length).toBeGreaterThan(0)
    expect(screen.queryByText('Maharashtra')).not.toBeInTheDocument()
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

  it('retries the employee list after a failed GET', async () => {
    const user = userEvent.setup()
    let attempts = 0

    server.use(
      http.get(employeesPath, () => {
        attempts += 1

        if (attempts === 1) {
          return HttpResponse.json({ message: 'Server error' }, { status: 500 })
        }

        return HttpResponse.json(mockEmployees)
      }),
    )

    renderWithProviders(<EmployeeManagementContainer />)

    expect(await screen.findByText(/unable to load employees/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /retry/i }))

    expect(await screen.findAllByText('Gauri Kotwal')).not.toHaveLength(0)
  })
})

describe('EmployeeManagementContainer search', () => {
  it('shows the employee returned by ID search', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.type(screen.getByLabelText(/search by employee id/i), '532')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(await screen.findAllByText('Gauri Kotwal')).not.toHaveLength(0)
    expect(screen.queryByText('Radhika')).not.toBeInTheDocument()
  })

  it('shows employee not found when the ID does not exist', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.type(screen.getByLabelText(/search by employee id/i), '999')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(await screen.findByText(/employee not found/i)).toBeInTheDocument()
    expect(
      screen.getByText(/no employee exists with that id/i),
    ).toBeInTheDocument()
    expect(screen.queryByText('Gauri Kotwal')).not.toBeInTheDocument()
  })

  it('shows an error when employee search fails', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(employeeByIdPath, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.type(screen.getByLabelText(/search by employee id/i), '532')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByText(/unable to search for that employee/i),
    ).toBeInTheDocument()
  })
})

describe('EmployeeManagementContainer CRUD', () => {
  it('creates an employee with POST and shows it in the list', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.click(screen.getByRole('button', { name: /add employee/i }))

    await user.type(screen.getByLabelText(/^name/i), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/^email/i), 'ada@example.com')
    await user.type(screen.getByLabelText(/^mobile/i), '9876543210')
    await user.click(screen.getByLabelText(/^country/i))
    await user.click(await screen.findByRole('option', { name: 'India' }))
    await user.type(screen.getByLabelText(/^state/i), 'Maharashtra')
    await user.type(screen.getByLabelText(/^district/i), 'Pune')
    await user.click(screen.getByRole('button', { name: /create employee/i }))

    expect(await screen.findByText(/employee created/i)).toBeInTheDocument()
    expect(await screen.findAllByText('Ada Lovelace')).not.toHaveLength(0)
  })

  it('updates an employee with PUT and refreshes the list', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.click(screen.getAllByRole('button', { name: /edit gauri kotwal/i })[0])

    const nameInput = await screen.findByLabelText(/^name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Gauri Updated')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText(/employee updated/i)).toBeInTheDocument()
    expect(await screen.findAllByText('Gauri Updated')).not.toHaveLength(0)
  })

  it('does not delete until the confirmation dialog is accepted', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.click(
      screen.getAllByRole('button', { name: /delete gauri kotwal/i })[0],
    )

    expect(await screen.findByText(/delete employee\?/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    await waitFor(() => {
      expect(screen.queryByText(/delete employee\?/i)).not.toBeInTheDocument()
    })
    expect(screen.getAllByText('Gauri Kotwal').length).toBeGreaterThan(0)
  })

  it('deletes an employee with DELETE after confirmation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.click(
      screen.getAllByRole('button', { name: /delete gauri kotwal/i })[0],
    )
    await user.click(await screen.findByRole('button', { name: /^delete$/i }))

    expect(await screen.findByText(/employee deleted/i)).toBeInTheDocument()
    expect(screen.queryByText('Gauri Kotwal')).not.toBeInTheDocument()
  })

  it('restores the full list after search is cleared', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.type(screen.getByLabelText(/search by employee id/i), '532')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(await screen.findAllByText('Gauri Kotwal')).not.toHaveLength(0)
    expect(screen.queryByText('Radhika')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^clear$/i }))

    expect(await screen.findAllByText('Radhika')).not.toHaveLength(0)
    expect(screen.getAllByText('Gauri Kotwal').length).toBeGreaterThan(0)
  })
})

async function fillCreateForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name/i), 'Ada Lovelace')
  await user.type(screen.getByLabelText(/^email/i), 'ada@example.com')
  await user.type(screen.getByLabelText(/^mobile/i), '9876543210')
  await user.click(screen.getByLabelText(/^country/i))
  await user.click(await screen.findByRole('option', { name: 'India' }))
  await user.type(screen.getByLabelText(/^state/i), 'Maharashtra')
  await user.type(screen.getByLabelText(/^district/i), 'Pune')
}

describe('EmployeeManagementContainer API errors', () => {
  it('keeps the create form open when POST fails so the user can retry', async () => {
    const user = userEvent.setup()
    server.use(
      http.post(employeesPath, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.click(screen.getByRole('button', { name: /add employee/i }))
    await fillCreateForm(user)
    await user.click(screen.getByRole('button', { name: /create employee/i }))

    expect(await screen.findByText(/unable to save employee/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /add employee/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create employee/i })).toBeEnabled()
    expect(screen.queryByText(/employee created/i)).not.toBeInTheDocument()

    server.resetHandlers()
    await user.click(screen.getByRole('button', { name: /create employee/i }))

    expect(await screen.findByText(/employee created/i)).toBeInTheDocument()
    expect(await screen.findAllByText('Ada Lovelace')).not.toHaveLength(0)
  })

  it('keeps the edit form open when PUT fails', async () => {
    const user = userEvent.setup()
    server.use(
      http.put(employeeByIdPath, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.click(screen.getAllByRole('button', { name: /edit gauri kotwal/i })[0])
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText(/unable to save employee/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /edit employee/i })).toBeInTheDocument()
    expect(screen.queryByText(/employee updated/i)).not.toBeInTheDocument()
  })

  it('shows a delete error and does not report success', async () => {
    const user = userEvent.setup()
    server.use(
      http.delete(employeeByIdPath, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.click(
      screen.getAllByRole('button', { name: /delete gauri kotwal/i })[0],
    )
    await user.click(await screen.findByRole('button', { name: /^delete$/i }))

    expect(await screen.findByText(/unable to delete employee/i)).toBeInTheDocument()
    expect(screen.getByText(/delete employee\?/i)).toBeInTheDocument()
    expect(screen.queryByText(/employee deleted/i)).not.toBeInTheDocument()
    expect(screen.getAllByText('Gauri Kotwal').length).toBeGreaterThan(0)
  })

  it('shows a country error in the form when GET /country fails', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(countriesPath, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.click(screen.getByRole('button', { name: /add employee/i }))

    expect(await screen.findByText(/unable to load countries/i)).toBeInTheDocument()
  })

  it('does not fetch countries until the add form opens', async () => {
    const user = userEvent.setup()
    let countryRequests = 0

    server.use(
      http.get(countriesPath, () => {
        countryRequests += 1
        return HttpResponse.json(mockCountries)
      }),
    )

    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    expect(countryRequests).toBe(0)

    await user.click(screen.getByRole('button', { name: /add employee/i }))

    await waitFor(() => {
      expect(countryRequests).toBe(1)
    })
    expect(await screen.findByLabelText(/^country/i)).toBeInTheDocument()
  })

  it('renders country options from the country API in the add form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EmployeeManagementContainer />)

    await screen.findAllByText('Gauri Kotwal')
    await user.click(screen.getByRole('button', { name: /add employee/i }))
    await user.click(screen.getByLabelText(/^country/i))

    expect(await screen.findByRole('option', { name: 'India' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Peru' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Ecuador' })).toBeInTheDocument()
  })
})
