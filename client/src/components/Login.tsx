import { Box, Button, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthData, loginUser } from '../apiCalls/authApiCall';
import { useDispatch } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Login: React.FC = () => {
    const dispatch=useDispatch();
    const navigate = useNavigate(); 
    const user = useSelector((state: RootState) => state.auth.user);
  const formSchema = yup.object({
    email: yup.string().email('Email format is not valid').required('Email is required'),
    password: yup.string().required('Password is required').min(10, 'Password must be at least 10 characters long')
    .max(50, 'Password cannot exceed 50 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(formSchema),
  });

 useEffect(()=>{
  if(user){
    user.role!=='superAdmin' ? navigate('/dashboard/main'): navigate('/admin-dashboard');
  }
 },[user,navigate]);

  const submitForm = (data: AuthData) => {
    dispatch(loginUser({email:data.email,password:data.password}));
  
  };

  return (
    <Box width="70%" height="70%" display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap="20px">
      <Typography variant="h3" fontWeight="bold">Welcome</Typography>
      <Typography variant="h4" fontWeight="bold">Sign in to our app</Typography>
      <FormControl
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px', my:"15px"}}
        onSubmit={handleSubmit(submitForm)}
      >
        
        <Box display="flex" justifyContent="center" alignItems="start" flexDirection="column" gap="5px">
            <FormLabel component="legend" sx={{fontSize:"16px", color:"black"}}>Email</FormLabel>
          <TextField
            id="outlined-basic"
            
            
            type="email"
            variant="outlined"
            {...register('email')}
          />
          <p style={{ fontSize: '12px' ,color:'red'}}>{errors.email?.message}</p>
        </Box>
        
        <Box display="flex" justifyContent="center" alignItems="start" flexDirection="column" gap="5px">
            <FormLabel component="legend" sx={{fontSize:"16px", color:"black"}}>Password</FormLabel>
          <TextField
            id="outlined-basic"
            type="password"
            
            variant="outlined"
            {...register('password')}
          />
          <p style={{ fontSize: '12px' ,color:'red'}}>{errors.password?.message}</p>
        </Box>
        <Button variant="contained" type="submit" color="success" style={{ marginTop: '16px' }}>
          Submit
        </Button>
      </FormControl>
    </Box>
  );
};

export default Login;
