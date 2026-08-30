import { createTheme } from '@mui/material/styles'

export const colors = {
  navy: '#0D1B2A',
  deepNavy: '#1B263B',
  teal: '#4B6B7C',
  steelBlue: '#3D5A80',
  airyBlue: '#98B4C7',
  skyBlue: '#C8D9E6',
  paleBlue: '#D8E6F2',
  iceBlue: '#EAF2F8',
  beige: '#F2EFE7',
  white: '#FFFFFF',
} as const

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.steelBlue,
      light: colors.airyBlue,
      dark: colors.deepNavy,
      contrastText: colors.iceBlue,
    },
    secondary: {
      main: colors.teal,
      contrastText: colors.iceBlue,
    },
    background: {
      default: colors.navy,
      paper: colors.deepNavy,
    },
    text: {
      primary: colors.iceBlue,
      secondary: colors.skyBlue,
    },
    divider: 'rgba(200, 217, 230, 0.18)',
    success: {
      main: colors.teal,
      contrastText: colors.iceBlue,
    },
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: 'Outfit, system-ui, sans-serif',
    h1: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0.04em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.06em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          colorScheme: 'dark',
        },
        body: {
          backgroundColor: colors.navy,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: colors.teal,
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: 'rgba(200, 217, 230, 0.35)',
          color: colors.iceBlue,
          '&:hover': {
            borderColor: colors.airyBlue,
            backgroundColor: 'rgba(61, 90, 128, 0.28)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 0,
          border: '1px solid rgba(200, 217, 230, 0.14)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.deepNavy,
          borderRadius: 0,
          border: '1px solid rgba(200, 217, 230, 0.2)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(200, 217, 230, 0.28)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.airyBlue,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.skyBlue,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.skyBlue,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: 'rgba(61, 90, 128, 0.28)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colors.skyBlue,
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        filledSuccess: {
          backgroundColor: colors.teal,
          color: colors.iceBlue,
        },
      },
    },
  },
})
