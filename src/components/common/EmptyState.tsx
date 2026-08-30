import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        textAlign: 'center',
        py: 6,
        px: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(27, 38, 59, 0.45)',
      }}
    >
      <Typography variant="h6" component="p" gutterBottom>
        {title}
      </Typography>
      {description ? (
        <Typography color="text.secondary">{description}</Typography>
      ) : null}
    </Box>
  )
}
