import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmployeeForm } from './EmployeeForm'
import { mockCountries } from '../../../test/fixtures/countries'
import { mockEmployees } from '../../../test/fixtures/employees'

const defaultProps = {
  open: true,
  countries: mockCountries,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
}

describe('EmployeeForm', () => {
  it('shows validation messages when required fields are empty', async () => {
    const user = userEvent.setup()
    render(<EmployeeForm {...defaultProps} mode="create" />)

    await user.click(screen.getByRole('button', { name: /create employee/i }))

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/mobile number is required/i)).toBeInTheDocument()
    expect(screen.getByText(/country is required/i)).toBeInTheDocument()
    expect(screen.getByText(/state is required/i)).toBeInTheDocument()
    expect(screen.getByText(/district is required/i)).toBeInTheDocument()
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  it('blocks create when email or mobile is invalid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <EmployeeForm {...defaultProps} mode="create" onSubmit={onSubmit} />,
    )

    await user.type(screen.getByLabelText(/^name/i), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/^email/i), 'not-an-email')
    await user.type(screen.getByLabelText(/^mobile/i), '123')
    await user.click(screen.getByLabelText(/^country/i))
    await user.click(await screen.findByRole('option', { name: 'India' }))
    await user.type(screen.getByLabelText(/^state/i), 'Maharashtra')
    await user.type(screen.getByLabelText(/^district/i), 'Pune')
    await user.click(screen.getByRole('button', { name: /create employee/i }))

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument()
    expect(
      screen.getByText(/mobile number must be 10 to 15 digits/i),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('blocks edit when required values are cleared', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <EmployeeForm
        {...defaultProps}
        mode="edit"
        employee={mockEmployees[0]}
        onSubmit={onSubmit}
      />,
    )

    await user.clear(screen.getByLabelText(/^email/i))
    await user.clear(screen.getByLabelText(/^mobile/i))
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/mobile number is required/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('pre-populates fields when editing an employee', async () => {
    render(
      <EmployeeForm
        {...defaultProps}
        mode="edit"
        employee={mockEmployees[0]}
      />,
    )

    expect(screen.getByLabelText(/^name/i)).toHaveValue('Gauri Kotwal')
    expect(screen.getByLabelText(/^email/i)).toHaveValue(
      'gaurikotwal@yopmail.com',
    )
    expect(screen.getByLabelText(/^mobile/i)).toHaveValue('8785456879')
    expect(screen.getByLabelText(/^country/i)).toHaveTextContent('Ecuador')
    expect(screen.getByLabelText(/^state/i)).toHaveValue('Maharashtra')
    expect(screen.getByLabelText(/^district/i)).toHaveValue('Pune')
  })

  it('submits valid create values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <EmployeeForm {...defaultProps} mode="create" onSubmit={onSubmit} />,
    )

    await user.type(screen.getByLabelText(/^name/i), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/^email/i), 'ada@example.com')
    await user.type(screen.getByLabelText(/^mobile/i), '9876543210')
    await user.click(screen.getByLabelText(/^country/i))
    await user.click(await screen.findByRole('option', { name: 'India' }))
    await user.type(screen.getByLabelText(/^state/i), 'Maharashtra')
    await user.type(screen.getByLabelText(/^district/i), 'Pune')
    await user.click(screen.getByRole('button', { name: /create employee/i }))

    expect(onSubmit).toHaveBeenCalledWith(
      {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune',
      },
      expect.anything(),
    )
  })
})
