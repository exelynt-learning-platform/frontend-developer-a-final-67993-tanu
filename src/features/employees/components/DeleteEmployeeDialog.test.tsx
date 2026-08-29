import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteEmployeeDialog } from './DeleteEmployeeDialog'
import { mockEmployees } from '../../../test/fixtures/employees'

describe('DeleteEmployeeDialog', () => {
  it('does not delete until the user confirms', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <DeleteEmployeeDialog
        employee={mockEmployees[0]}
        open
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    expect(screen.getByText(/permanently remove gauri kotwal/i)).toBeInTheDocument()
    expect(onConfirm).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm when delete is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <DeleteEmployeeDialog
        employee={mockEmployees[0]}
        open
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />,
    )

    await user.click(screen.getByRole('button', { name: /^delete$/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
