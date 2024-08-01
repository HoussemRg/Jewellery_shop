import { Box, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SideBar from '../../components/SideBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Layout: React.FC = () => {
    const [isSideBarOpened, setIsSideBarOpened] = useState<boolean>(true);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = useSelector((state: RootState) => state?.auth.user);

    return (
        <Box display="flex" height="100vh" width="100%">
            
            <Box
                component="nav"
                sx={{
                    transition: 'width 0.3s',
                    width: isSideBarOpened ? '250px' : '0px',
                    overflow: 'hidden',
                    flexShrink: 0, 
                    display: isNonMobile ? 'block' : 'none', 
                }}
            >
                <SideBar
                    isNonMobile={isNonMobile}
                    drawerWidth="250px"
                    isSideBarOpened={isSideBarOpened}
                    setIsSideBarOpened={setIsSideBarOpened}
                />
            </Box>

            {/* Main Content Area */}
            <Box display="flex" flexDirection="column" flexGrow={1} >
                {/* Navbar */}
                <Box flexShrink={0}>
                    <Navbar
                        user={user}
                        isSideBarOpened={isSideBarOpened}
                        setIsSideBarOpened={setIsSideBarOpened}
                    />
                </Box>

                {/* Outlet for Page Content */}
                <Box flexGrow={1} p={isNonMobile ? '20px' : '10px'}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default Layout;