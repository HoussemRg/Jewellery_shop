import { useTheme,AppBar,Toolbar,IconButton, InputBase, Button, Box, Typography, Menu, MenuItem } from '@mui/material';
import React, {  useState } from 'react'
import {ArrowDropDownOutlined, DarkModeOutlined, LightModeOutlined, Menu as MenuIcon, Search, SettingsOutlined} from '@mui/icons-material'
import FlexBetween from './FlexBetween';
import { themeActions } from '../slices/themeSlice';
import Photo from '../assets/photo.png'
import { authActions, UserLoggedInState } from '../slices/authSlice';
import { useDispatch } from '../hooks';
import { useNavigate } from 'react-router-dom';
interface NavbarProps {
    user:UserLoggedInState | null;
    isSideBarOpened: boolean;
    setIsSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
    
  }

const Navbar :React.FC<NavbarProps>= ({user,isSideBarOpened,setIsSideBarOpened}) => {
    const dispatch =useDispatch();
    const theme=useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const handleClick = (event:React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const logout=()=>{
      dispatch(authActions.logout());
      setAnchorEl(null)
      navigate('/')
    }
    const navigate=useNavigate();

    const navigateToUserProfile=()=>{
      navigate(`/dashboard/users/${user?.id}`);
      handleClose();
    }

   

    
  return (
    <AppBar sx={{
        position:'static',
        background:'none',
        boxShadow:'none'
    }}>
        <Toolbar sx={{justifyContent:'space-between'}} >
            <FlexBetween>
                <IconButton onClick={()=> setIsSideBarOpened(!isSideBarOpened)}>
                    <MenuIcon />
                </IconButton>
                <FlexBetween bgcolor={theme.palette.background.paper} 
                            borderRadius="9px"
                            gap="3rem"
                            p="0.1rem  1.5rem"
                    >
                    <InputBase placeholder='Search...' />
                    <IconButton>
                        <Search />
                    </IconButton>
                </FlexBetween>
            </FlexBetween>
            <FlexBetween gap="1.5rem">
                <IconButton onClick={()=> dispatch(themeActions.setMode())} >
                    {
                        theme.palette.mode === 'dark' ?
                        ( <DarkModeOutlined sx={{fontSize:"25px"}} />)
                        : <LightModeOutlined sx={{fontSize:"25px"}} />
                    }
                </IconButton>
                <IconButton  >
                    <SettingsOutlined sx={{fontSize:"25px"}} />
                </IconButton>
                <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={Photo}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user?.firstName + ' ' + user?.lastName}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user?.role}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={navigateToUserProfile}>Profile</MenuItem>
              <MenuItem onClick={logout}>Log Out</MenuItem>
              
            </Menu>
          </FlexBetween>
            </FlexBetween>
        </Toolbar>
    </AppBar>

  )
}

export default Navbar
