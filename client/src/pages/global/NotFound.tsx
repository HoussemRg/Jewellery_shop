import { Box, Typography, Button, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  const theme = useTheme();
    
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={theme.palette.background.default}
      color={theme.palette.text.primary}
      textAlign="center"
      px={3}
    >
      <Typography variant="h1" fontWeight="bold" color={theme.palette.error.main}>
        404
      </Typography>
      <Typography variant="h4" mb={3}>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={5}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Button
        component={Link}
        to={ "/dashboard/products"}
        variant="contained"
        color="primary"
        sx={{ textTransform: 'none', padding: '10px 20px', fontSize: '1rem' }}
      >
        Return to Home
      </Button>
    </Box>
  );
};

export default NotFound;