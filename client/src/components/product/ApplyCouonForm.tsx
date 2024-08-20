import React, { useEffect } from 'react'
import { couponActions, FilteredCoupon } from '../../slices/couponSlice';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { HighlightOffOutlined } from '@mui/icons-material';
import { useDispatch } from '../../hooks';
import { applyCoupon, getAllCoupons } from '../../apiCalls/couponApiCall';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export interface ApplyCouponFormProps {
    handleCloseCouponForm: () => void;
    open: boolean;
    FilteredCoupon: FilteredCoupon[];
    itemId:string
   
}
export interface ApplyCouponData{
    coupon:string;
}
const ApplyCouonForm:React.FC<ApplyCouponFormProps> = ({handleCloseCouponForm,open,FilteredCoupon,itemId}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const {isCouponApplied} =useSelector((state:RootState)=> state.coupon)
    const formSchema = yup.object({
        coupon: yup.string().required('Coupon name is required'),
       
    });
    const dispatch=useDispatch()
    const { register, handleSubmit, formState: { errors },reset } = useForm<ApplyCouponData>({
        resolver: yupResolver(formSchema),
    })

    const submitForm=(data:ApplyCouponData)=>{
        dispatch(applyCoupon(data.coupon,itemId))
    }
    useEffect(() => {
        if (isCouponApplied) {
          dispatch(getAllCoupons());
          handleCloseCouponForm();
          reset();
          dispatch(couponActions.setIsCouponApplied(false));
        }
      }, [isCouponApplied, dispatch, handleCloseCouponForm]);
  return (
    <Dialog
            onClose={handleCloseCouponForm}
            open={open}
            fullWidth
            maxWidth="sm"
            fullScreen={fullScreen}
            sx={{ '& .MuiDialog-paper': { overflowX: 'hidden' } }}
        >
            <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
                <Box>Apply Coupon</Box>
                <Button onClick={handleCloseCouponForm} color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} sx={{ padding: 0 }}>
                    <HighlightOffOutlined />
                </Button>
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        
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
                        id="coupon"
                        select
                        label="Select Coupon"
                        defaultValue=''
                        error={!!errors.coupon}
                        helperText={errors.coupon?.message}
                        {...register('coupon')}
                    >
                        {FilteredCoupon.map((coupon) => (
                            <MenuItem key={coupon._id} value={coupon._id}>
                                {coupon.couponName}
                            </MenuItem>
                        ))}
                        </TextField>
                    <DialogActions>
                        <Button autoFocus onClick={handleCloseCouponForm} color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>
                            Cancel
                        </Button>
                        <Button type="submit" color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>
                            Submit
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
  )
}

export default ApplyCouonForm
