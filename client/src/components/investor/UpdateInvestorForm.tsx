import { yupResolver } from '@hookform/resolvers/yup';
import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { investorActions, InvestorType } from '../../slices/investorSlice';
import { updateInvestor } from '../../apiCalls/investorApiCall';
interface UpdateInvestorProps{
    handleCloseEditForm: () => void,
    opendEditForm: boolean,
    investorToUpdate:InvestorType,

}
export interface InvestorEditData{
    firstName: string,
    lastName: string,
    cin: string,
    address: string,
    phoneNumber:string,
  
}

const UpdateInvestorForm: React.FC<UpdateInvestorProps> = ({ handleCloseEditForm, opendEditForm, investorToUpdate}) => {
    const theme = useTheme();
    const {isInvestorUpdated} = useSelector((state:RootState)=> state.investor)
    const dispatch=useDispatch();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    
    const formSchema = yup.object({
      firstName: yup.string().min(3).max(50).trim().required(),
      lastName: yup.string().min(3).max(50).trim().required(),
      cin: yup.string().matches(/^\d+$/, 'CIN must contain only numbers').length(8, 'CIN must be exactly 8 digits long').required(),
      address: yup.string().min(3).max(50).trim().required(),
      phoneNumber: yup.string().matches(/^\d+$/, 'Phone number must contain only numbers').length(8, 'Phone number must be exactly 8 digits long').required(),
     
    });
    
    const { register, handleSubmit, formState: { errors } } = useForm<InvestorEditData>({
      resolver: yupResolver(formSchema),
      defaultValues: {
        firstName: investorToUpdate.firstName,
        lastName: investorToUpdate.lastName,
        cin: investorToUpdate.cin,
        address: investorToUpdate.address,
        phoneNumber: investorToUpdate.phoneNumber,
      }
    });
    
    const submitForm = (data: InvestorEditData) => {
        const validDataForm: Partial<InvestorEditData> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                validDataForm[key as  keyof InvestorEditData] = value;
            }
        });
        dispatch(updateInvestor(validDataForm,investorToUpdate._id))
        
    }
    useEffect(()=>{
      if(isInvestorUpdated){
        handleCloseEditForm();
        dispatch(investorActions.setIsInvestorUpdated(false))
           
    }
    },[isInvestorUpdated])
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
          <Box>Update Investor</Box>
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
              flexWrap: 'nowrap', 
              flexDirection:"column",
              justifyContent: 'space-between', 
              alignItems: 'center',
              '& .MuiTextField-root': {
                m: 1,
                width: '100%',
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
  
  export default UpdateInvestorForm;
