import { useTheme,AppBar,Toolbar,IconButton, InputBase } from '@mui/material';
import React from 'react'
import {DarkModeOutlined, LightModeOutlined, Menu as MenuIcon, Search, SettingsOutlined} from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import FlexBetween from './FlexBetween';
import { themeActions } from '../slices/themeSlice';

interface NavbarProps {
    
    isSideBarOpened: boolean;
    setIsSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
    
  }

const Navbar :React.FC<NavbarProps>= ({isSideBarOpened,setIsSideBarOpened}) => {
    const dispatch =useDispatch();
    const theme=useTheme();
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
            </FlexBetween>
        </Toolbar>
    </AppBar>

  )
}

export default Navbar
