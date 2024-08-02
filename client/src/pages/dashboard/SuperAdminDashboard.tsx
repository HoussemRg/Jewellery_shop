import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import { useDispatch } from "../../hooks";
import { themeActions } from "../../slices/themeSlice";
import {
  ArrowDropDownOutlined,
  DarkModeOutlined,
  LightModeOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { authActions } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import Photo from "../../assets/photo.png";
import Stores from "../stores/Stores";

const SuperAdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const logout = () => {
    dispatch(authActions.logout());
    setAnchorEl(null);
    navigate("/");
  };
  const navigate = useNavigate();

  const navigateToUserProfile = () => {
    navigate(`/users/${user?.id}`);
    handleClose();
  };
  return (
    <Box display="flex" flexDirection="column" flexGrow={1} gap={5}>
      <Box flexShrink={0}>
        <AppBar
          sx={{
            position: "static",
            background: "none",
            boxShadow: "none",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h2" color="primary">
              LOGO
            </Typography>
            <FlexBetween gap="1.5rem">
              <IconButton onClick={() => dispatch(themeActions.setMode())}>
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlined sx={{ fontSize: "25px" }} />
                ) : (
                  <LightModeOutlined sx={{ fontSize: "25px" }} />
                )}
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
                      {user?.firstName + " " + user?.lastName}
                    </Typography>
                    <Typography
                      fontSize="0.75rem"
                      sx={{ color: theme.palette.secondary[200] }}
                    >
                      {user?.role}
                    </Typography>
                  </Box>
                  <ArrowDropDownOutlined
                    sx={{
                      color: theme.palette.secondary[300],
                      fontSize: "25px",
                    }}
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
      </Box>

      <Box width="100%" >
        <Stores />
      </Box>
    </Box>
  );
};

export default SuperAdminDashboard;
