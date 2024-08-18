import { Box, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SideBar from '../../components/SideBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TopRightCard from '../../components/Card/TopRightCard';
import { useDispatch } from '../../hooks';
import { cardActions } from '../../slices/cardSlice';

const Layout: React.FC = () => {
    const [isSideBarOpened, setIsSideBarOpened] = useState<boolean>(true);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state?.auth.user);
    const { isCardOpened, productsList } = useSelector((state: RootState) => state.card);

    const handleCloseCard = () => {
        dispatch(cardActions.setIsCardToggled(false));
    };

    return (
        <Box display="flex" height="100vh" width="100%">
            {/* Sidebar */}
            <Box
                component="nav"
                sx={{
                    transition: 'width 0.3s',
                    width: isSideBarOpened ? (isNonMobile ? '250px' : '200px') : '0px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'block',
                }}
            >
                <SideBar
                    isNonMobile={isNonMobile}
                    drawerWidth={isNonMobile ? '250px' : '200px'}
                    isSideBarOpened={isSideBarOpened}
                    setIsSideBarOpened={setIsSideBarOpened}
                />
            </Box>

            {/* Main Content Area */}
            <Box display="flex" flexDirection="column" flexGrow={1}>
                {/* Navbar */}
                <Box flexShrink={0} sx={{ overflowX: 'hidden' }}>
                    <Navbar
                        user={user}
                        isSideBarOpened={isSideBarOpened}
                        setIsSideBarOpened={setIsSideBarOpened}
                    />
                </Box>

                {/* Outlet for Page Content */}
                <Box flexGrow={1} p={isNonMobile ? '20px' : '10px'}>
                    <Outlet />
                    {isCardOpened && productsList.length > 0 && (
                        <TopRightCard handleClose={handleCloseCard} />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;