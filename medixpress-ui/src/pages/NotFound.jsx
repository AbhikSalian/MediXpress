import React from 'react';
import { Container, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4">404</Typography>
      <Typography variant="h6">Page not found</Typography>
    </Container>
  );
}
