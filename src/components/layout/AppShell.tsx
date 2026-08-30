import Box from '@mui/material/Box'
import type { ReactNode } from 'react'
import { colors } from '../../theme'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.navy,
        color: 'text.primary',
      }}
    >
      {children}
    </Box>
  )
}
