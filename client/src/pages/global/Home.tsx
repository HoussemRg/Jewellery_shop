import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import Login from '../../components/Login';
import image from '../../assets/bg.jpg';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  
  return (
    <Box width="100vw" height="100vh">
      <Grid container height="100%">
        {isMdUp && (
          <Grid item md={6}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Login />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;