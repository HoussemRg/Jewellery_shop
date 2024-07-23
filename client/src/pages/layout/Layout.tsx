import { Box, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import SideBar from '../../components/SideBar'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

const Layout:React.FC = () => {
    const [isSideBarOpened,setIsSideBarOpened]=useState<boolean>(true);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user=useSelector((state:RootState)=> state?.auth.user)
  return (
    <Box height={'100%'} width={'100%'} display={isNonMobile ? 'flex' : 'block'}>
    
            <SideBar
            isNonMobile={isNonMobile}
            drawerWidth="250px"
            isSideBarOpened={isSideBarOpened}
            setIsSideBarOpened={setIsSideBarOpened}
            />
            
            
        
        <Box flexGrow={1}>
        <Navbar
            user={user} 
            isSideBarOpened={isSideBarOpened}
            setIsSideBarOpened={setIsSideBarOpened} />
            <Outlet />
        </Box>
        
    </Box>
  )
}

export default Layout
