import { screen } from '@testing-library/react'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

describe('App shell', () => {
  it('renders the employee management heading', async () => {
    renderWithProviders(<App />)

    expect(
      await screen.findByRole('heading', { name: /employee management/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add employee/i }),
    ).toBeInTheDocument()
  })
})
