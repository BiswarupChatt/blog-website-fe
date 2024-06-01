import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ErrorPage() {

  return (
    <Container sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h1" component="div" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="div" gutterBottom>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        It seems that the page you were trying to reach doesn't exist anymore, or maybe it has just moved.
      </Typography>
      <Box mt={4}>
        <Button component={Link} to='/' variant="contained" color="primary">
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}
