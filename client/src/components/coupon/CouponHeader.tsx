import React, { useEffect } from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AddCouponForm from './AddCouponForm';
import { useDispatch } from '../../hooks';
import { getAllCategories } from '../../apiCalls/categoryApiCalls';
import { getAllSubCategories } from '../../apiCalls/subCategoryApiCalls';

const CouponHeader :React.FC = () => {
    const theme=useTheme();
    const [open, setOpen] = React.useState<boolean>(false);
    const {user}=useSelector((state:RootState)=>state.auth)
    const dispatch=useDispatch();
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
            
    };
    useEffect(()=>{
      dispatch(getAllCategories());
      dispatch(getAllSubCategories());
    },[])
    
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant='h3' color={theme.palette.secondary[100]} fontWeight="bold" mb="5px">
          Coupons
          </Typography>
          <Typography variant='h5' color={theme.palette.secondary[300]}>
          List of Coupons
          </Typography>
        </Box>
        <Box>
        {user?.role !== "vendor" && <Button variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen} color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>
        <Typography variant='h5' >
            Add
          </Typography> 
        </Button>}
          
          <AddCouponForm handleClose={handleClose} open={open} />
        </Box>
        
      
    </Box>
  )
}

export default CouponHeader
