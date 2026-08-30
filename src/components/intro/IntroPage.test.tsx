import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/renderWithProviders'
import { IntroPage } from './IntroPage'

describe('IntroPage', () => {
  it('renders the system title and opens management on Manage', async () => {
    const user = userEvent.setup()
    const onManage = vi.fn()

    renderWithProviders(<IntroPage onManage={onManage} />)

    expect(
      screen.getByRole('heading', { name: /employee management system/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /manage/i }))
    expect(onManage).toHaveBeenCalledTimes(1)
  })
})
