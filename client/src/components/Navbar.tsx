import { useTheme, AppBar, Toolbar, IconButton, Button, Box, Typography, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { ArrowDropDownOutlined, DarkModeOutlined,HomeOutlined, LightModeOutlined, Menu as MenuIcon } from '@mui/icons-material';
import FlexBetween from './FlexBetween';
import { themeActions } from '../slices/themeSlice';
import Photo from '../assets/photo.png';
import { authActions, UserLoggedInState } from '../slices/authSlice';
import { useDispatch } from '../hooks';
import { useNavigate } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { cardActions } from '../slices/cardSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { userActions } from '../slices/userSlice';
import { productActions } from '../slices/productSlice';
import { categoryActions } from '../slices/categorySlice';
import { subCategoryActions } from '../slices/subCategorySlice';
import { clientActions } from '../slices/clientSlice';
import { orderActions } from '../slices/orderSlice';
import { couponActions } from '../slices/couponSlice';
import { investmentActions } from '../slices/investmentSlice';
import { investorActions } from '../slices/investorSlice';
import { gainActions } from '../slices/gainSlice';

interface NavbarProps {
  user: UserLoggedInState | null;
  isSideBarOpened: boolean;
  setIsSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ user, isSideBarOpened, setIsSideBarOpened }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isCardOpened, productsList } = useSelector((state: RootState) => state.card);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const logout = () => {
    dispatch(authActions.logout());
    dispatch(userActions.getAllVendorsPerStore([]));
        dispatch(productActions.getProducts([]));
        dispatch(productActions.getProductsNumber(0));
        dispatch(productActions.resetFiltredProducts());
        dispatch(productActions.getTopProducts([]));
        dispatch(categoryActions.getAllCategories([]));
        dispatch(subCategoryActions.getAllSubCategories([]));
        dispatch(clientActions.getAllClients([]));
        dispatch(orderActions.getAllOrders([]));
        dispatch(cardActions.clearProductsList());
        dispatch(productActions.resetFiltredProductsCount());
        dispatch(couponActions.getAllCoupons([]));
        dispatch(investmentActions.getAllInvestments([]));
        dispatch(investorActions.getAllInvestors([]));
        dispatch(gainActions.getGain(null));
        dispatch(gainActions.getGainPerYear([]));
    setAnchorEl(null);
    navigate('/');
  };
  const navigate = useNavigate();

  const navigateToUserProfile = () => {
    navigate(`/dashboard/users/${user?.id}`);
    handleClose();
  };
  const navigateToAdminSuperDashboard= () => {
    navigate(`/admin-dashboard`);
  };
  const handleToggleCard = () => {
    dispatch(cardActions.setIsCardToggled(!isCardOpened));
  };

  return (
    <AppBar
      sx={{
        position: 'static',
        background: 'none',
        boxShadow: 'none',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          padding: '0 16px',
          overflow: 'hidden',
          flexWrap: 'nowrap',
        }}
      >
        <FlexBetween sx={{ overflow: 'hidden', maxWidth: '60%' }}>
          <IconButton onClick={() => setIsSideBarOpened(!isSideBarOpened)}>
            <MenuIcon />
          </IconButton>
          
        </FlexBetween>
        <FlexBetween gap="0.5rem">
          {productsList.length > 0 && (
            <IconButton onClick={handleToggleCard}>
              <ShoppingCartOutlinedIcon />
            </IconButton>
          )}
          {user?.role === "superAdmin" &&  <IconButton onClick={navigateToAdminSuperDashboard}>
                  <HomeOutlined />
          </IconButton>}
          <IconButton onClick={() => dispatch(themeActions.setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlined sx={{ fontSize: '25px' }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: '25px' }} />
            )}
          </IconButton>
          
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textTransform: 'none',
                gap: '0.5rem',
                minWidth: 0,
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={Photo}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: 'cover' }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary[100] }}
                  noWrap
                >
                  {user?.firstName + ' ' + user?.lastName}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[200] }}
                  noWrap
                >
                  {user?.role}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: '25px' }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <MenuItem onClick={navigateToUserProfile}>Profile</MenuItem>
              <MenuItem onClick={logout}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;