import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmployeeSearch } from './EmployeeSearch'

describe('EmployeeSearch', () => {
  it('submits the entered employee ID', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    const onClear = vi.fn()

    render(
      <EmployeeSearch
        onSearch={onSearch}
        onClear={onClear}
      />,
    )

    await user.type(screen.getByLabelText(/search by employee id/i), '532')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(onSearch).toHaveBeenCalledWith('532')
  })

  it('does not search when the ID is empty', () => {
    const onSearch = vi.fn()

    render(<EmployeeSearch onSearch={onSearch} onClear={vi.fn()} />)

    expect(screen.getByRole('button', { name: /^search$/i })).toBeDisabled()
    expect(onSearch).not.toHaveBeenCalled()
  })
})
