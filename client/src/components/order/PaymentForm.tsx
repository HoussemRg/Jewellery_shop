import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import { getAllOrders, payForOrder } from '../../apiCalls/orderApiCall';
import { orderActions } from '../../slices/orderSlice';

export interface FormProps {
  handleClose: () => void,
  open: boolean,
  orderId: string;
  
}



export interface PaymentData { 
    payedAmount: number,  
}

const PaymentForm: React.FC<FormProps> = ({ handleClose, open,orderId }) => {
  const dispatch = useDispatch();
  const {isOrderPaid} =useSelector((state:RootState)=> state.order)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const formSchema = yup.object({
    payedAmount: yup.number().required('Payment Amount is required'),
    
  });

  const { register, handleSubmit, formState: { errors },reset } = useForm<PaymentData>({
    resolver: yupResolver(formSchema),

  });
 
  

  const submitForm = (data: PaymentData) => {
    dispatch(payForOrder(data,orderId));    
  }
 
  useEffect(() => {
    if (isOrderPaid) {
      dispatch(getAllOrders());
      reset();
      dispatch(orderActions.setIsOrderPaid(false));
      handleClose();
      
      
    }
  }, [isOrderPaid, dispatch, handleClose]);
 
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
        <Box>Pay for order</Box>
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
            id="payedAmount"
            label="Amount to pay"
            placeholder="Amount to pay"
            error={!!errors.payedAmount}
            helperText={errors.payedAmount?.message}
            {...register('payedAmount')}
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

export default PaymentForm;