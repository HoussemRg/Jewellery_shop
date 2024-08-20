import { Box, Button, Typography, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import AddProductForm from './product/AddProductForm';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { useDispatch } from '../hooks';
import { getAllCategories } from '../apiCalls/categoryApiCalls';
import { getAllSubCategories } from '../apiCalls/subCategoryApiCalls';
import AddIcon from '@mui/icons-material/Add';

interface HeaderProps{
    title:string,
    subtitle:string
}



const Header:React.FC<HeaderProps> = ({title,subtitle}:HeaderProps) => {
  const dispatch=useDispatch();
    const theme=useTheme();
    const [open, setOpen] = React.useState<boolean>(false);
    const {categories}=useSelector((state:RootState)=> state.category);
    const {subCategories}=useSelector((state:RootState)=> state.subCategory);
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
          {title}
          </Typography>
          <Typography variant='h5' color={theme.palette.secondary[300]}>
          {subtitle}
          </Typography>
        </Box>
        <Box>
        <Button variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen} color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} >
        <Typography variant='h5' >
            Add
          </Typography> 
        </Button>
        
          <AddProductForm handleClose={handleClose} open={open} categories={categories} subCategories={subCategories} />
        </Box>
        
      
    </Box>
  )
}

export default Header
