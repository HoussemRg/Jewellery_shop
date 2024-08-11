import { yupResolver } from '@hookform/resolvers/yup';
import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { couponActions } from '../../slices/couponSlice';
import { CouponType } from '../../slices/couponSlice';
import { updateCoupon } from '../../apiCalls/couponApiCall';
interface UpdateCouponProps{
    handleCloseEditForm: () => void,
    opendEditForm: boolean,
    couponToUpdate:CouponType,

}
export interface CouponEditData{
    couponName: string,
    startDate: Date,
    expirationDate: Date,
    discountRate: number,
  
}

const UpdateCouponForm: React.FC<UpdateCouponProps> = ({ handleCloseEditForm, opendEditForm, couponToUpdate}) => {
    const theme = useTheme();
    const {isCouponUpdated} = useSelector((state:RootState)=> state.coupon)
    const dispatch=useDispatch();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    
    const formSchema = yup.object({
        couponName: yup.string().required('Coupon Name is required').min(3).max(50).trim(),
        startDate: yup.date().required('Last Name  is required'),
        expirationDate: yup.date().required('Last Name  is required'),
        discountRate: yup.number().required('discountRate  is required'),
     
    });
    
    const { register, handleSubmit, formState: { errors } } = useForm<CouponEditData>({
      resolver: yupResolver(formSchema),
      defaultValues: {
        couponName: couponToUpdate.couponName,
        startDate: couponToUpdate.startDate,
        expirationDate: couponToUpdate.expirationDate,
        discountRate: couponToUpdate.discountRate,
      }
    });
    
    const submitForm = (data: CouponEditData) => {
        const validDataForm: Partial<CouponEditData> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                validDataForm[key as  keyof CouponEditData] = value;
            }
        });
        dispatch(updateCoupon(validDataForm,couponToUpdate._id))
        
    }
    useEffect(()=>{
      if(isCouponUpdated){
        handleCloseEditForm();
        dispatch(couponActions.setIsCouponUpdated(false))
           
    }
    },[isCouponUpdated])
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
          <Box>Update Coupon</Box>
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
            required
            InputLabelProps={{ shrink: true }}
            id="couponName"
            label="Coupon Name"
            placeholder="Coupon Name"
            error={!!errors.couponName}
            helperText={errors.couponName?.message}
            {...register('couponName')}
          />
         <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="startDate"
            label="Start Date"
            type="date"
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
            {...register('startDate')}
         />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="expirationDate"
            label="Expiration Date"
            type="date"
            error={!!errors.expirationDate}
            helperText={errors.expirationDate?.message}
            {...register('expirationDate')}
          />
          <TextField
            id="discountRate"
            label="Discount Rate"
            type="number"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
            error={!!errors.discountRate}
            helperText={errors.discountRate?.message}
            {...register('discountRate')}
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
  
  export default UpdateCouponForm;
