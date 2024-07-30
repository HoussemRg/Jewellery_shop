import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import { Box, Drawer } from '@mui/material';
import React, { ReactElement, useState } from 'react';
import FlexBetween from './FlexBetween';
import { CalendarMonthOutlined, CategoryOutlined, ChevronLeft, CurrencyExchangeOutlined, DiscountOutlined, Groups2Outlined, HomeOutlined, PersonPinOutlined, PieChartOutlineOutlined, PointOfSaleOutlined, ReceiptLongOutlined, ShoppingCartOutlined, StorefrontOutlined, SupervisedUserCircleOutlined, TodayOutlined, TrendingUpOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

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

    const navItems: NavItem[] = [
        { text: "Dashboard", icon: <HomeOutlined />, link: "" },
        { text: "Client Facing", icon: null, link: "" },
        { text: "Products", icon: <ShoppingCartOutlined />, link: "/products" },
        { text: "Customers", icon: <Groups2Outlined />, link: "" },
        { text: "Transactions", icon: <ReceiptLongOutlined />, link: "" },
        { text: "Categories", icon: <CategoryOutlined />, link: "" },
        { text: "Sub-Categories", icon: <CategoryOutlined />, link: "" },
        { text: "Sales", icon: null, link: "" },
        { text: "Overview", icon: <PointOfSaleOutlined />, link: "" },
        { text: "Daily", icon: <TodayOutlined />, link: "" },
        { text: "Monthly", icon: <CalendarMonthOutlined />, link: "" },
        { text: "Breakdown", icon: <PieChartOutlineOutlined />, link: "" },
        { text: "Business", icon: null, link: "" },
        { text: "Suppliers", icon: <SupervisedUserCircleOutlined />, link: "" },
        { text: "Investors", icon: <CurrencyExchangeOutlined />, link: "" },
        { text: "Discounts", icon: <DiscountOutlined />, link: "" },
        { text: "Management", icon: null, link: "" },
        { text: "Store", icon: <StorefrontOutlined />, link: "" },
        { text: "Vendors", icon: <PersonPinOutlined />, link: "/vendors" },
        { text: "Performance", icon: <TrendingUpOutlined />, link: "" },
    ];

    return (
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
                },
            }}
        >
            <Box width="100%">
                <Box m="0.5rem 0.1rem 0rem 3rem">
                    <FlexBetween color={theme.palette.secondary.main}>
                        <Box display='flex' alignItems="center" gap="0.5rem">
                            <Typography variant="h4" fontWeight="bold" >LOGO</Typography>
                        </Box>
                        {!isNonMobile && (
                            <IconButton onClick={() => setIsSideBarOpened(!isSideBarOpened)}>
                                <ChevronLeft />
                            </IconButton>
                        )}
                    </FlexBetween>
                </Box>
                <List>
                    {navItems.map(({ text, icon, link }) => {
                        if (!icon) {
                            return (
                                <Typography key={text} sx={{ m: "0.5rem 0 0.5rem 3rem" }}> {text}</Typography>
                            )
                        }

                        return (
                            <ListItem disablePadding key={text}>
                                <ListItemButton
                                    component={Link}
                                    to={link}
                                    sx={{
                                        backgroundColor: "transparent",
                                        ":hover": {
                                            backgroundColor: theme.palette.secondary[300],
                                            color: theme.palette.primary[600]
                                        },
                                        color: theme.palette.secondary[100],
                                        py: 0.3
                                    }}
                                    onClick={() => setActiveItem(text)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            ":hover": { color: theme.palette.primary[600] },
                                            color: theme.palette.secondary[100],
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
        </Drawer>
    );
}

export default SideBar;