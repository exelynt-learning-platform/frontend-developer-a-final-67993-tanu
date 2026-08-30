import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { colors } from '../../theme'
import { AppShell } from '../layout/AppShell'

interface IntroPageProps {
  onManage: () => void
}

export function IntroPage({ onManage }: IntroPageProps) {
  return (
    <AppShell>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 6,
        }}
      >
        <Box
          sx={{
            maxWidth: 760,
            width: '100%',
            textAlign: 'center',
            px: { xs: 3, md: 8 },
            py: { xs: 6, md: 9 },
            border: `1px solid ${colors.skyBlue}33`,
            bgcolor: colors.deepNavy,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              color: colors.airyBlue,
              letterSpacing: '0.42em',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}
          >
            Personnel control
          </Typography>

          <Typography
            component="h1"
            sx={{
              mt: 1.5,
              fontWeight: 600,
              letterSpacing: { xs: '0.06em', md: '0.12em' },
              lineHeight: 1.15,
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.25rem' },
              textTransform: 'uppercase',
              color: colors.iceBlue,
            }}
          >
            Employee Management System
          </Typography>

          <Box
            aria-hidden="true"
            sx={{
              width: 64,
              height: 2,
              mx: 'auto',
              my: 3,
              bgcolor: colors.beige,
              opacity: 0.7,
            }}
          />

          <Typography
            sx={{
              maxWidth: 480,
              mx: 'auto',
              color: colors.skyBlue,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            A focused workspace to search, add, update, and remove employee
            records.
          </Typography>

          <Button
            type="button"
            variant="contained"
            size="large"
            onClick={onManage}
            sx={{
              mt: 5,
              px: 5,
              py: 1.4,
              minWidth: 200,
              letterSpacing: '0.28em',
              borderRadius: 0,
              bgcolor: colors.steelBlue,
              color: colors.iceBlue,
              border: `1px solid ${colors.airyBlue}66`,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
          >
            Manage
          </Button>
        </Box>
      </Box>
    </AppShell>
  )
}
