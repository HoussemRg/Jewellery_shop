import { Box, Typography, Button, LinearProgress } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import { verifyEmail } from '../../apiCalls/authApiCall';

const EmailVerification: React.FC = () => {
  const { isEmailVerified,isLoading } = useSelector((state: RootState) => state.auth);
  const { userId, token } = useParams();
  const dispatch = useDispatch();

  const hasFetched = useRef(false); 

  useEffect(() => {
    if (userId && token && !hasFetched.current) {
      dispatch(verifyEmail(userId, token));
      hasFetched.current = true; 
    }
  }, [dispatch, userId, token]);

  return (
    <Box width="100%" height="100%">
            {isLoading ? (<Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>) :
           (<Box
            width="100%"
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="#f5f5f5"
            padding="2rem"
          >
            <Box
              textAlign="center"
              maxWidth="400px"
              width="100%"
              padding="2rem"
              borderRadius="8px"
              boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
              bgcolor={isEmailVerified ? "#e0f7fa" : "#ffebee"}
            >
              {isEmailVerified ? (
                <>
                  <Typography variant="h5" color="primary" gutterBottom>
                    Account Verified Successfully
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    Please login to continue.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/"
                    fullWidth
                  >
                    Go to Login Page
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h5" color="error" gutterBottom>
                    Page Not Found
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    The link may be invalid or expired.
                  </Typography>
                </>
              )}
            </Box>
          </Box>) 
           }
            


        </Box>
    
  );
};

export default EmailVerification;
