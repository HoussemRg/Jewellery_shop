import { yupResolver } from '@hookform/resolvers/yup';
import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { useDispatch } from '../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { storeActions, StoreOriginalType } from '../slices/storeSlice';
import { updateStore } from '../apiCalls/storApiCall';
interface UpdateStoreProps{
    handleCloseEditForm: () => void,
    opendEditForm: boolean,
    storeToUpdate:StoreOriginalType,

}
export interface StoreEditData{
    storeName: string,
    description: string,
    address: string,
    
  
}

const UpdateStoreForm: React.FC<UpdateStoreProps> = ({ handleCloseEditForm, opendEditForm, storeToUpdate }) => {
    const theme = useTheme();
    const {isStoreUpdated} = useSelector((state:RootState)=> state.store)
    const dispatch=useDispatch();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    
    const formSchema = yup.object({
      storeName: yup.string().min(3).max(50).trim().required(),
      description: yup.string().min(5).trim().required(),
      address: yup.string().min(5).trim().required(),
     
    });
    
    const { register, handleSubmit, formState: { errors } } = useForm<StoreEditData>({
      resolver: yupResolver(formSchema),
      defaultValues: {
        storeName: storeToUpdate.storeName,
        description: storeToUpdate.description,
        address: storeToUpdate.address,
      }
    });
    
    const submitForm = (data: StoreEditData) => {
        const validDataForm: Partial<StoreEditData> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                validDataForm[key as  keyof StoreEditData] = value;
            }
        });
        dispatch(updateStore(validDataForm,storeToUpdate._id))
        
    }
    useEffect(()=>{
      if(isStoreUpdated){
        handleCloseEditForm();
        dispatch(storeActions.setIsStoreUpdated(false))
           
    }
    },[isStoreUpdated])
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
          <Box>Update Store</Box>
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
              id="storeName"
              label="Store Name"
              placeholder="Store Name"
              error={!!errors.storeName}
              helperText={errors.storeName?.message}
              {...register('storeName')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              id="description"
              label="Description "
              placeholder="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register('description')}
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
  
  export default UpdateStoreForm;
