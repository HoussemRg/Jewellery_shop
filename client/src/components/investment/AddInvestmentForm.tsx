import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { createInvestment, getAllInvestments } from '../../apiCalls/investmentApiCall';
import { investmentActions } from '../../slices/investmentSlice';
import { getAllInvestors } from '../../apiCalls/investorApiCall';

export interface FormProps {
  handleClose: () => void,
  open: boolean,
  
}



export interface InvestmentData {
  
  investmentName: string,
  investor: string,
  startDate: Date,
  endDate: Date,
  investmentAmount: number,
  
  
}

const AddInvestmentForm: React.FC<FormProps> = ({ handleClose, open }) => {
  const dispatch = useDispatch();
  const {isInvestmentCreated} =useSelector((state:RootState)=> state.investment)
  const {investors}=useSelector((state:RootState)=> state.investor)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(()=>{
    dispatch(getAllInvestors());
  },[])

  const formSchema = yup.object({
    investmentName: yup.string().required('Investment Name is required').min(3).max(50).trim(),
    investor: yup.string().required('Investor is required').trim(),
    startDate: yup.date().required('Start Date  is required'),
    endDate: yup.date().required('End Date is required').test('is-greater', 'End Date must be greater than Start Date', function(value) {
        const { startDate } = this.parent;
        return value > startDate;
      }),
    investmentAmount: yup.number().required('Investment Amount is required').min(0),
  });

  const { register, handleSubmit, formState: { errors },reset } = useForm<InvestmentData>({
    resolver: yupResolver(formSchema),

  });
 
  

  const submitForm = (data: InvestmentData) => {
    dispatch(createInvestment(data));    
  }

  useEffect(() => {
    if (isInvestmentCreated) {
      dispatch(getAllInvestments());
      handleClose();
      reset();
      dispatch(investmentActions.setIsInvestmentCreated(false));
    }
  }, [isInvestmentCreated, dispatch, handleClose]);
 
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
        <Box>Add New Investment</Box>
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
            flexDirection:'column',
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
            id="investmentName"
            label="Investment Name"
            placeholder="First Name"
            error={!!errors.investmentName}
            helperText={errors.investmentName?.message}
            {...register('investmentName')}
          />
          <TextField
            id="investor"
            select
            label="Select Investor"
          
            defaultValue=''
            error={!!errors.investor}
            helperText={errors.investor?.message}
            {...register('investor')}
          >
            {investors.map((inv) => (
              <MenuItem key={inv._id} value={inv._id}>
                {inv.firstName + ' ' + inv.lastName}
              </MenuItem>
            ))}
          </TextField>
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
            id="endDate"
            label="End Date"
            type="date"
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
            {...register('endDate')}
         />
          <TextField
            id="investmentAmount"
            label="Investment Amount"
            type="number"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
            error={!!errors.investmentAmount}
            helperText={errors.investmentAmount?.message}
            {...register('investmentAmount')}
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

export default AddInvestmentForm;