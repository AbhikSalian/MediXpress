import React from 'react'
import { Box, Typography, Container } from '@mui/material'

const PublicFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.100',
        py: 2,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
        >
          © 2025 MediXpress. All rights reserved. | Empowering Pharmacy Owners Everywhere
        </Typography>
      </Container>
    </Box>
  )
}

export default PublicFooter