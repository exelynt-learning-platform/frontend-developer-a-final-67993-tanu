import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

describe('App shell', () => {
  it('shows the intro page first', () => {
    renderWithProviders(<App />)

    expect(
      screen.getByRole('heading', { name: /employee management system/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /manage/i })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /add employee/i }),
    ).not.toBeInTheDocument()
  })

  it('opens the employee workspace after Manage is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)

    await user.click(screen.getByRole('button', { name: /manage/i }))

    expect(
      await screen.findByRole('heading', { name: /^employee management$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add employee/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument()
  })

  it('returns to the intro from Home', async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)

    await user.click(screen.getByRole('button', { name: /manage/i }))
    await user.click(await screen.findByRole('button', { name: /home/i }))

    expect(
      screen.getByRole('heading', { name: /employee management system/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /add employee/i }),
    ).not.toBeInTheDocument()
  })
})
