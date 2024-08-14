import { Box } from '@mui/material'
import React from 'react'
import SuperAdminNavbar from '../../components/SuperAdminNavbar'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Outlet } from 'react-router-dom'

const SuperAdminLayout:React.FC = () => {
    const user = useSelector((state: RootState) => state?.auth.user);
  
    
  return (
    <Box display="flex" height="100vh" width="100%">
            <Box display="flex" flexDirection="column" flexGrow={1} >
                {/* Navbar */}
                <Box flexShrink={0}>
                    <SuperAdminNavbar
                        user={user}
                    />
                </Box>

                {/* Outlet for Page Content */}
                <Box flexGrow={1}>
                    <Outlet />
                    
                </Box>
            </Box>
        </Box>
  )
}

export default SuperAdminLayout
