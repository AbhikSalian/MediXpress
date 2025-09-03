import React from 'react';
import { Box, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mt: 6 }}>
      <Container>
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} MediXpress. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
