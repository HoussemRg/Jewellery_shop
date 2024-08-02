import { yupResolver } from '@hookform/resolvers/yup';
import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { userActions, UserType } from '../../slices/userSlice';
import { useDispatch } from '../../hooks';
import { updateUser } from '../../apiCalls/userApiCall';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
interface UpdateUserProps{
    handleCloseEditForm: () => void,
    opendEditForm: boolean,
    userToUpdate:UserType,

}
export interface UserEditData{
    firstName: string,
    lastName: string,
    cin: string,
    password?: string | null,
    address: string,
    phoneNumber:string,
  
}

const UpdateUserForm: React.FC<UpdateUserProps> = ({ handleCloseEditForm, opendEditForm, userToUpdate }) => {
    const theme = useTheme();
    const {isUserUpdated} = useSelector((state:RootState)=> state.user)
    const dispatch=useDispatch();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    
    const formSchema = yup.object({
      firstName: yup.string().min(3).max(50).trim().required(),
      lastName: yup.string().min(3).max(50).trim().required(),
      cin: yup.string().matches(/^\d+$/, 'CIN must contain only numbers').length(8, 'CIN must be exactly 8 digits long').required(),
      
      password: yup.string().min(10, 'Password must be at least 10 characters long')
        .max(50, 'Password cannot exceed 50 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value).notRequired(),
      address: yup.string().min(3).max(50).trim().required(),
      phoneNumber: yup.string().matches(/^\d+$/, 'Phone number must contain only numbers').length(8, 'Phone number must be exactly 8 digits long').required(),
     
    });
    
    const { register, handleSubmit, formState: { errors } } = useForm<UserEditData>({
      resolver: yupResolver(formSchema),
      defaultValues: {
        firstName: userToUpdate.firstName,
        lastName: userToUpdate.lastName,
        cin: userToUpdate.cin,
        address: userToUpdate.address,
        phoneNumber: userToUpdate.phoneNumber,
      }
    });
    
    const submitForm = (data: UserEditData) => {
        const validDataForm: Partial<UserEditData> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                validDataForm[key as  keyof UserEditData] = value;
            }
        });
        dispatch(updateUser(validDataForm,userToUpdate._id))
        
    }
    useEffect(()=>{
      if(isUserUpdated){
        handleCloseEditForm();
        dispatch(userActions.setIsUserUpdated(false))
           
    }
    },[isUserUpdated])
    return (
      <Dialog
        onClose={handleCloseEditForm}
        open={opendEditForm}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        sx={{ '& .MuiDialog-paper': { overflowX: 'hidden' } }}
      >
        <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
          <Box>Add New User</Box>
          <Button
            onClick={handleCloseEditForm}
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
              InputLabelProps={{ shrink: true }}
              id="firstName"
              label="First Name"
              placeholder="First Name"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              id="lastName"
              label="Last Name"
              placeholder="Last Name"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register('lastName')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              id="cin"
              label="CIN"
              placeholder="CIN"
              error={!!errors.cin}
              helperText={errors.cin?.message}
              {...register('cin')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              id="address"
              label="Address"
              placeholder="Address"
              error={!!errors.address}
              helperText={errors.address?.message}
              {...register('address')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              id="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
            
            <TextField
              InputLabelProps={{ shrink: true }}
              type='password'
              id="password"
              label="Password"
              placeholder="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />
            
            <DialogActions>
              <Button autoFocus onClick={handleCloseEditForm} color="warning">
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
  
  export default UpdateUserForm;
