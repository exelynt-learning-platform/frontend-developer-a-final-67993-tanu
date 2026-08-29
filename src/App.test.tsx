import { render, screen } from '@testing-library/react'
import { AppProviders } from './app/providers'
import App from './App'

describe('App shell', () => {
  it('renders the employee management heading', () => {
    render(
      <AppProviders>
        <App />
      </AppProviders>,
    )

    expect(
      screen.getByRole('heading', { name: /employee management/i }),
    ).toBeInTheDocument()
  })
})
