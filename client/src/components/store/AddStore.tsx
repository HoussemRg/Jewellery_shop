import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import { createStore, getAllStores } from '../../apiCalls/storApiCall';
import { storeActions } from '../../slices/storeSlice';

export interface FormProps {
  handleClose: () => void,
  open: boolean,
  
}



export interface StoreData {
  storeName: string,
  description: string,
  address: string,
  
}

const AddStoreForm: React.FC<FormProps> = ({ handleClose, open }) => {
  const dispatch = useDispatch();
  const {isStoreCreated} =useSelector((state:RootState)=> state.store)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const formSchema = yup.object({
    storeName: yup.string().required('Store Name is required').min(3).max(50).trim(),
    description: yup.string().required('Description  is required').min(3).trim(),    
    address: yup.string().required('Address required').min(5).max(50).trim(),
   
  });

  const { register, handleSubmit, formState: { errors },reset } = useForm<StoreData>({
    resolver: yupResolver(formSchema),

  });
 
 


  const submitForm = (data: StoreData) => {
    dispatch(createStore(data));        
  }

  useEffect(() => {
    if (isStoreCreated) {
      dispatch(getAllStores());
      handleClose();
      reset();
      dispatch(storeActions.setIsStoreCreated(false));
    }
  }, [isStoreCreated, dispatch, handleClose]);
 
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
            id="storeName"
            label="Store Name"
            placeholder="Store Name"
            error={!!errors.storeName}
            helperText={errors.storeName?.message}
            {...register('storeName')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="description"
            label="Description"
            placeholder="Description"
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register('description')}
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

export default AddStoreForm;