import React from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddUserForm from './AddUserForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const UsersHeader :React.FC = () => {
    const theme=useTheme();
    const [open, setOpen] = React.useState<boolean>(false);
    const {user}=useSelector((state:RootState)=>state.auth)

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
          Users of this store
          </Typography>
          <Typography variant='h5' color={theme.palette.secondary[300]}>
          List of Users
          </Typography>
        </Box>
        <Box>
        {user?.role !== "vendor" && <Button variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen} color="secondary">
        <Typography variant='h5' >
            Add
          </Typography> 
        </Button>}
          
          <AddUserForm handleClose={handleClose} open={open} />
        </Box>
        
      
    </Box>
  )
}

export default UsersHeader
