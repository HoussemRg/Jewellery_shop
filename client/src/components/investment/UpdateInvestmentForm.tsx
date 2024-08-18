import { yupResolver } from '@hookform/resolvers/yup';
import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { investmentActions, InvestmentType } from '../../slices/investmentSlice';
import { updateInvestment } from '../../apiCalls/investmentApiCall';
import { getAllInvestors } from '../../apiCalls/investorApiCall';
interface UpdateInvestmentProps{
    handleCloseEditForm: () => void,
    opendEditForm: boolean,
    investmentToUpdate:InvestmentType,

}
export interface InvestmentEditData{
    investmentName: string,
    investor: string,
    startDate: Date | null,
    endDate: Date | null,
    investmentAmount: number,
}

const UpdateInvestmentForm: React.FC<UpdateInvestmentProps> = ({ handleCloseEditForm, opendEditForm, investmentToUpdate}) => {
    const theme = useTheme();
    const {isInvestmentUpdated} = useSelector((state:RootState)=> state.investment)
    const dispatch=useDispatch();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    useEffect(()=>{
      dispatch(getAllInvestors());
    },[])
    const formSchema = yup.object({
        investmentName: yup.string().required('Investment Name is required').min(3).max(50).trim(),
        investor: yup.string().required('Investor is required').trim(),
        startDate: yup.date().required('Start Date is required').nullable(),
        endDate: yup.date().required('End Date is required').test('is-greater', 'End Date must be greater than Start Date', function(value) {
            const { startDate } = this.parent;
            return value > startDate;
        }).nullable(),
        investmentAmount: yup.number().required('Investment Amount is required').min(0),
    });
     

    
    const { register, handleSubmit, formState: { errors } } = useForm<InvestmentEditData>({
      resolver: yupResolver(formSchema),
      defaultValues: {
        investmentName: investmentToUpdate.investmentName,
        startDate: investmentToUpdate.startDate,
        endDate: investmentToUpdate.endDate,
        investmentAmount: investmentToUpdate.investmentAmount,
      }
    });
    const submitForm = (data: InvestmentEditData) => {
        const validDataForm: Partial<InvestmentEditData> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                validDataForm[key as  keyof InvestmentEditData] = value;
            }
        });
        dispatch(updateInvestment(validDataForm,investmentToUpdate._id))
        
    }
    useEffect(()=>{
      if(isInvestmentUpdated){
        handleCloseEditForm();
        dispatch(investmentActions.setIsInvestmentUpdated(false))
           
    }
    },[isInvestmentUpdated])
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
          <Box>Update Investment</Box>
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
  
  export default UpdateInvestmentForm;
