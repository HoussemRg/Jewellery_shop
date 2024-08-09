import React from 'react'
import { Box, Typography, useTheme } from '@mui/material';


const OrderHeader :React.FC = () => {
    const theme=useTheme();


   
    
  return (
    <Box>
        <Typography variant='h3' color={theme.palette.secondary[100]} fontWeight="bold" mb="5px">
          Orders
          </Typography>
          <Typography variant='h5' color={theme.palette.secondary[300]}>
          List of Orders
          </Typography>
        
      
    </Box>
  )
}

export default OrderHeader
