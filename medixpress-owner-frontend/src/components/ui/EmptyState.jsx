import React from 'react'
import { Box, Typography, Button } from '@mui/material'

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        p: 4,
        textAlign: 'center',
        color: 'text.secondary',
        ...props.sx,
      }}
      {...props}
    >
      {Icon && (
        <Icon
          sx={{
            fontSize: 64,
            mb: 2,
            opacity: 0.5,
          }}
        />
      )}
      <Typography variant="h6" gutterBottom color="text.primary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ mb: 3, maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {actionText && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  )
}

export default EmptyState