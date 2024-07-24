import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'


interface HeaderProps{
    title:string,
    subtitle:string
}

const Header:React.FC<HeaderProps> = ({title,subtitle}:HeaderProps) => {
    const theme=useTheme();
  return (
    <Box>
        <Typography variant='h3' color={theme.palette.secondary[100]} fontWeight="bold" mb="5px">
        {title}
        </Typography>
        <Typography variant='h5' color={theme.palette.secondary[300]}>
        {subtitle}
        </Typography>
      
    </Box>
  )
}

export default Header
