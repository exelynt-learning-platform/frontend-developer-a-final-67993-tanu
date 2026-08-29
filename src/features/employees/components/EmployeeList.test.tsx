import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmployeeList } from './EmployeeList'
import { mockEmployees } from '../../../test/fixtures/employees'

describe('EmployeeList', () => {
  it('renders summary fields and hides location details until View more is clicked', async () => {
    const user = userEvent.setup()
    render(<EmployeeList employees={mockEmployees} />)

    expect(screen.getAllByText('Gauri Kotwal').length).toBeGreaterThan(0)
    expect(screen.getAllByText('532').length).toBeGreaterThan(0)
    expect(screen.getAllByText('gaurikotwal@yopmail.com').length).toBeGreaterThan(
      0,
    )
    expect(screen.getAllByText('arungovil@yopmail.com').length).toBeGreaterThan(0)
    expect(screen.getAllByText('8785456879').length).toBeGreaterThan(0)
    expect(screen.getAllByText('IT').length).toBeGreaterThan(0)
    expect(screen.queryByText('Ecuador')).not.toBeInTheDocument()
    expect(screen.queryByText('Maharashtra')).not.toBeInTheDocument()
    expect(screen.queryByText('Pune')).not.toBeInTheDocument()

    await user.click(
      screen.getAllByRole('button', { name: /view more for gauri kotwal/i })[0],
    )

    expect((await screen.findAllByText('Ecuador')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('17').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Maharashtra').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Pune').length).toBeGreaterThan(0)
  })
})
