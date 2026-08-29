import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmployeeList } from './EmployeeList'
import { mockEmployees } from '../../../test/fixtures/employees'

describe('EmployeeList', () => {
  it('renders summary fields and hides location details until a row is clicked', async () => {
    const user = userEvent.setup()
    render(
      <EmployeeList
        employees={mockEmployees}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getAllByText('Gauri Kotwal').length).toBeGreaterThan(0)
    expect(screen.getAllByText('532').length).toBeGreaterThan(0)
    expect(screen.getAllByText('gaurikotwal@yopmail.com').length).toBeGreaterThan(
      0,
    )
    expect(screen.queryByText('Email ID')).not.toBeInTheDocument()
    expect(screen.queryByText('arungovil@yopmail.com')).not.toBeInTheDocument()
    expect(screen.getAllByText('8785456879').length).toBeGreaterThan(0)
    expect(screen.getAllByText('IT').length).toBeGreaterThan(0)
    expect(screen.queryByText('Ecuador')).not.toBeInTheDocument()
    expect(screen.queryByText('Maharashtra')).not.toBeInTheDocument()
    expect(screen.queryByText('Pune')).not.toBeInTheDocument()

    await user.click(screen.getAllByText('Gauri Kotwal')[0])

    const details = await screen.findAllByRole('region', {
      name: /location details for gauri kotwal/i,
    })

    expect(details[0]).toHaveTextContent('Country : Ecuador')
    expect(details[0]).toHaveTextContent('Country ID : 17')
    expect(details[0]).toHaveTextContent('State : Maharashtra')
    expect(details[0]).toHaveTextContent('District : Pune')
  })

  it('keeps View more on the clicked employee instead of the next row', async () => {
    const user = userEvent.setup()
    render(
      <EmployeeList
        employees={mockEmployees}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    await user.click(
      screen.getAllByRole('button', { name: /view more for gauri kotwal/i })[0],
    )

    const details = await screen.findAllByRole('region', {
      name: /location details for gauri kotwal/i,
    })

    expect(details[0]).toHaveTextContent('Country ID : 17')
    expect(
      screen.queryByRole('region', { name: /location details for radhika/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /view less for gauri kotwal/i })
        .length,
    ).toBeGreaterThan(0)
  })

  it('toggles the shutter from View more without opening edit or delete', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <EmployeeList
        employees={mockEmployees}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    await user.click(
      screen.getAllByRole('button', { name: /view more for gauri kotwal/i })[0],
    )

    expect(
      await screen.findByRole('region', {
        name: /location details for gauri kotwal/i,
      }),
    ).toBeInTheDocument()
    expect(onEdit).not.toHaveBeenCalled()
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('calls onEdit and onDelete for the selected employee', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <EmployeeList
        employees={mockEmployees}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getAllByRole('button', { name: /edit gauri kotwal/i })[0])
    await user.click(
      screen.getAllByRole('button', { name: /delete gauri kotwal/i })[0],
    )

    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: '532', name: 'Gauri Kotwal' }),
    )
    expect(onDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: '532', name: 'Gauri Kotwal' }),
    )
  })
})
