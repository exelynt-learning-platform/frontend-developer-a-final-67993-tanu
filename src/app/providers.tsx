import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import type { ReactNode } from 'react'
import { store as defaultStore, type AppStore } from './store'
import { theme } from '../theme'

interface AppProvidersProps {
  children: ReactNode
  store?: AppStore
}

export function AppProviders({
  children,
  store = defaultStore,
}: AppProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  )
}
