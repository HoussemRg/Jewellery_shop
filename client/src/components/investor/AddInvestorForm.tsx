import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { createInvestor, getAllInvestors } from '../../apiCalls/investorApiCall';
import { investorActions } from '../../slices/investorSlice';

export interface FormProps {
  handleClose: () => void,
  open: boolean,
  
}



export interface InvestorData {
  
  firstName: string,
  lastName: string,
  cin: string,
  email: string,
  address: string,
  phoneNumber:string,
  
}

const AddInvestorForm: React.FC<FormProps> = ({ handleClose, open }) => {
  const dispatch = useDispatch();
  const {isInvestorCreated} =useSelector((state:RootState)=> state.investor)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const formSchema = yup.object({
    firstName: yup.string().required('First Name is required').min(3).max(50).trim(),
    lastName: yup.string().required('Last Name  is required').min(3).max(50).trim(),
    cin: yup.string().required('CIN  is required').matches(/^\d+$/, 'CIN must contain only numbers').length(8, 'CIN must be exactly 8 digits long'),
    email: yup.string().required('email is required'),
    address: yup.string().required('Address required').min(3).max(50).trim(),
    phoneNumber: yup.string().required('Phone Number is required').matches(/^\d+$/, 'Phone number must contain only numbers').length(8, 'Phone number must be exactly 8 digits long'),
  });

  const { register, handleSubmit, formState: { errors },reset } = useForm<InvestorData>({
    resolver: yupResolver(formSchema),

  });
 
  

  const submitForm = (data: InvestorData) => {
    dispatch(createInvestor(data));    
  }

  useEffect(() => {
    if (isInvestorCreated) {
      dispatch(getAllInvestors());
      handleClose();
      reset();
      dispatch(investorActions.setIsInvestorCreated(false));
    }
  }, [isInvestorCreated, dispatch, handleClose]);
 
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
        <Box>Add New Investor</Box>
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

export default AddInvestorForm;