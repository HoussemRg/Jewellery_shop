import { 
    IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme 
} from '@mui/material';
import { Box, Drawer } from '@mui/material';
import React, { ReactElement, useState, useEffect } from 'react';
import FlexBetween from './FlexBetween';
import { 
    CategoryOutlined, ChevronLeft, CurrencyExchangeOutlined, DiscountOutlined, 
    Groups2Outlined, HomeOutlined, PersonPinOutlined, ReceiptLongOutlined, 
    ShoppingCartOutlined, StorefrontOutlined, SupervisedUserCircleOutlined 
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SideBarProps {
    drawerWidth: string;
    isSideBarOpened: boolean;
    setIsSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isNonMobile: boolean;
}

interface NavItem {
    text: string;
    icon: null | ReactElement;
    link: string;
}

const SideBar: React.FC<SideBarProps> = ({ isNonMobile, drawerWidth, isSideBarOpened, setIsSideBarOpened }) => {
    const theme = useTheme();
    const [activeItem, setActiveItem] = useState<string>('Dashboard');
    const { user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    const navItems: NavItem[] = [
        { text: "Dashboard", icon: <HomeOutlined />, link: "/dashboard/main" },
        { text: "Client Facing", icon: null, link: "" },
        { text: "Products", icon: <ShoppingCartOutlined />, link: "/dashboard/products" },
        { text: "Customers", icon: <Groups2Outlined />, link: "/dashboard/clients" },
        { text: "Transactions", icon: <ReceiptLongOutlined />, link: "/dashboard/orders" },
        { text: "Categories", icon: <CategoryOutlined />, link: "/dashboard/categories" },
        { text: "Sub-Categories", icon: <CategoryOutlined />, link: "/dashboard/subCategories" },
        { text: "Business", icon: null, link: "" },
        { text: "Discounts", icon: <DiscountOutlined />, link: "/dashboard/coupons" },
        { text: "Investors", icon: <CurrencyExchangeOutlined />, link: "/dashboard/investors" },
        { text: "Investments", icon: <SupervisedUserCircleOutlined />, link: "/dashboard/investments" },
        { text: "Management", icon: null, link: "" },
        { text: "Store", icon: <StorefrontOutlined />, link: `/dashboard/stores/${user?.store}` },
        { text: "Vendors", icon: <PersonPinOutlined />, link: "/dashboard/vendors" },
    ];

    // Close sidebar when location changes
    useEffect(() => {
        if (!isNonMobile) {
            setIsSideBarOpened(false);
        }
    }, [location, isNonMobile, setIsSideBarOpened]);

    const drawerContent = (
        <Box width="100%" height="100%" display="flex" flexDirection="column">
            <Box m="0.5rem 0.1rem 0rem 3rem">
                <FlexBetween color={theme.palette.secondary.main}>
                    <Box display='flex' alignItems="center" gap="0.5rem">
                        <Typography variant="h4" fontWeight="bold">LOGO</Typography>
                    </Box>
                    {!isNonMobile && (
                        <IconButton onClick={() => setIsSideBarOpened(!isSideBarOpened)}>
                            <ChevronLeft />
                        </IconButton>
                    )}
                </FlexBetween>
            </Box>
            <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {navItems.map(({ text, icon, link }) => {
                    if (!icon) {
                        return (
                            <Typography key={text} sx={{ m: "0.5rem 0 1rem 3rem" }}> {/* Increased bottom margin */}
                                {text}
                            </Typography>
                        )
                    }

                    return (
                        <ListItem disablePadding key={text} sx={{ mb: 0.5 }}> {/* Increased bottom margin */}
                            <ListItemButton
                                component={Link}
                                to={link}
                                sx={{
                                    backgroundColor: activeItem === text ? theme.palette.secondary[300] : "transparent",
                                    ":hover": {
                                        backgroundColor: theme.palette.secondary[300],
                                        color: theme.palette.primary[600]
                                    },
                                    color: activeItem === text ? theme.palette.primary[600] : theme.palette.secondary[100],
                                    py: 1, 
                                    px: 2, 
                                    borderRadius: '4px',
                                }}
                                onClick={() => setActiveItem(text)}
                            >
                                <ListItemIcon
                                    sx={{
                                        ":hover": { color: theme.palette.primary[600] },
                                        color: activeItem === text ? theme.palette.primary[600] : theme.palette.secondary[100],
                                        ml: "1rem",
                                        minWidth: 32
                                    }}
                                >
                                    {icon}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <>
            {isNonMobile ? (
                <Drawer
                    open={isSideBarOpened}
                    onClose={() => setIsSideBarOpened(false)}
                    variant='persistent'
                    anchor='left'
                    sx={{
                        width: drawerWidth,
                        "& .MuiDrawer-paper": {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.secondary[200],
                            boxSizing: "border-box",
                            borderWidth: isNonMobile ? 0 : "2px",
                            width: drawerWidth,
                            transition: 'width 0.3s',
                            overflow: 'hidden', // Prevent horizontal scrolling
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    open={isSideBarOpened}
                    onClose={() => setIsSideBarOpened(false)}
                    variant='temporary'
                    anchor='left'
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.secondary[200],
                            width: drawerWidth,
                            transition: 'width 0.3s',
                            overflow: 'hidden', 
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
}

export default SideBar;
