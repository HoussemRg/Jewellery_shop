import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from '../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getVendorsPerStore, registerUser } from '../apiCalls/userApiCall';
import { userActions } from '../slices/userSlice';

export interface FormProps {
  handleClose: () => void,
  open: boolean,
  
}



export interface UserData {
  
  firstName: string,
  lastName: string,
  cin: string,
  email: string,
  password: string,
  address: string,
  store: string,
  phoneNumber:string,
  role:string
}

const AddUserForm: React.FC<FormProps> = ({ handleClose, open }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const {isUserCreated} =useSelector((state:RootState)=> state.user)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const formSchema = yup.object({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name description is required'),
    cin: yup.string().required('CIN  is required'),
    email: yup.string().required('email is required'),
    password: yup.string().required('Password is required'),
    address: yup.string().required('Address required'),
    phoneNumber: yup.string().required('Phone Number is required'),
    role: yup.string().required('Role category is required'),
    store: yup.string().required('Store category is required').notOneOf([''], 'Store is required'),
  });

  const { register, handleSubmit, formState: { errors },reset } = useForm<UserData>({
    resolver: yupResolver(formSchema),

  });
 
  const stores=[
    {
        id:"1",
        store:"669c67f0f81299154926a3ea"
    },
    {
        id:"2",
        store:"669c67f0f81299154926a3ea"
    },
    {
        id:"3",
        store:"669c67f0f81299154926a3ea"
    }
]
const roles=[
    {
        id:"a",
        role:"admin"
    },
    {
        id:"v",
        role:"vendor"
    }
]


  const submitForm = (data: UserData) => {
    dispatch(registerUser(data));
    
        handleClose();
    reset();
    
    
  }

  useEffect(() => {
    if (isUserCreated && user) {
      dispatch(getVendorsPerStore(user?.store));
      dispatch(userActions.setIsUserCreated(false));
    }
  }, [isUserCreated, dispatch, handleClose]);
 
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      sx={{ '& .MuiDialog-paper': { overflowX: 'hidden' } }}
    >
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
        <Box>Add New User</Box>
        <Button
          onClick={handleClose}
          color="warning"
          sx={{ padding: 0 }}
        >
          <HighlightOffOutlined />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            '& .MuiTextField-root': {
              m: 1,
              width: fullScreen ? '100%' : 'calc(50% - 16px)',
              boxSizing: 'border-box',
            },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(submitForm)}
        >
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="firstName"
            label="First Name"
            placeholder="First Name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register('firstName')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="lastName"
            label="Last Name"
            placeholder="Last Name"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="cin"
            label="CIN"
            placeholder="CIN"
            error={!!errors.cin}
            helperText={errors.cin?.message}
            {...register('cin')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="address"
            label="Address"
            placeholder="Address"
            error={!!errors.address}
            helperText={errors.address?.message}
            {...register('address')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="phoneNumber"
            label="Phone Number"
            placeholder="Phone Number"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            {...register('phoneNumber')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            type='email'
            id="email"
            label="Email"
            placeholder="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            type='password'
            id="password"
            label="Password"
            placeholder="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />
          {
             user?.role === 'superAdmin' ? (
                <TextField
                  id="store"
                  select
                  label="Select Store"
                  defaultValue=''
                  error={!!errors.store}
                  helperText={errors.store?.message}
                  {...register('store')}
                >
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.store}>
                      {store.store}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  id="store"
                  label="Store"
                  value={user?.store || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                  helperText={errors.store?.message}
                  {...register('store')}
                />
              )
          }
          <TextField
            id="role"
            select
            label="Select Role"
            defaultValue={ "vendor"}
            
            error={!!errors.store}
            helperText={errors.store?.message}
            {...register('role')}
            >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.role}>
                {role.role}
              </MenuItem>
            ))}
          </TextField>
          
          
          
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="warning">
              Cancel
            </Button>
            <Button type="submit" color="success">
              Submit
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserForm;