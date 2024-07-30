import React from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UpdateUserForm from './UpdateUserForm';
import AddUserForm from './AddUserForm';

const VendorsHeader :React.FC = () => {
    const theme=useTheme();
    const [open, setOpen] = React.useState<boolean>(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);      
    };
    
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant='h3' color={theme.palette.secondary[100]} fontWeight="bold" mb="5px">
          Vendors
          </Typography>
          <Typography variant='h5' color={theme.palette.secondary[300]}>
          List of Vendors
          </Typography>
        </Box>
        <Box>
        <Button variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen} color="secondary">
        <Typography variant='h5' >
            Add
          </Typography> 
        </Button>
          
          <AddUserForm handleClose={handleClose} open={open} />
        </Box>
        
      
    </Box>
  )
}

export default VendorsHeader
