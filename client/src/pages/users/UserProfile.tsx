import { Box, Grid, IconButton, LinearProgress, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import image from '../../assets/photo.png';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import { deleteUser, getSingleUser } from '../../apiCalls/userApiCall';
import { format } from 'date-fns';
import UpdateUserForm from '../../components/user/UpdateUserForm';
import { authActions } from '../../slices/authSlice';
import { userActions } from '../../slices/userSlice';

const UserProfile: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate=useNavigate();
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const { singleUser,isUserDeleted,isLoading } = useSelector((state: RootState) => state.user);
    const [openEditForm, setOpenEditForm] = React.useState<boolean>(false);
    const handleClickOpenEditForm = () => {
        setOpenEditForm(true);
      };
      const handleCloseEditForm = () => {
        setOpenEditForm(false);
        if (id) {
            dispatch(getSingleUser(id));
        }
              
      };
    useEffect(() => {
        if (id) {
            dispatch(getSingleUser(id));
        }
    }, [id, dispatch]);
    const handleDelete = (id: string) => {
        dispatch(deleteUser(id));
        
      };
      useEffect(()=>{
        if(isUserDeleted){
            if(id===user?.id){
                dispatch(authActions.logout());             
                navigate('/');
                dispatch(userActions.setIsUserDeleted(false));
            }else{
                dispatch(userActions.setIsUserDeleted(false));
                navigate('/dashboard/vendors');
            }
        }
        
      })
    const formatDateString = (dateString: Date | null | undefined) => {
        return dateString ? format(new Date(dateString), 'yyyy-MM-dd') : 'N/A';
    };

    return (
        <Box width="100%" height="100%">
        {isLoading ? (<Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>) :(
            <Box 
            bgcolor={theme.palette.background.default} 
            height="100%" 
            p={2}
        >
            {singleUser && <UpdateUserForm handleCloseEditForm={handleCloseEditForm} opendEditForm={openEditForm} userToUpdate={singleUser}   />}
            <Grid container height="100%" columnSpacing={1}>
                <Grid item xs={12} md={5} bgcolor={theme.palette.background.paper} height="100%" width="100%">
                    <Box
                        display="flex"
                        height="100%"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        gap="20px"
                        width="100%"
                        margin="0 auto"
                        maxWidth="400px"
                        p={2}
                    >
                        <Box 
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="35%"
                            width="52%"
                            borderRadius="50%"
                            overflow="hidden"
                            sx={{ boxShadow: `0 4px 8px ${theme.palette.grey[500]}` }}
                        >
                            <img 
                                src={image} 
                                alt="user photo" 
                                width="100%" 
                                height="100%" 
                                style={{ borderRadius: '50%' }} 
                            />
                        </Box>
                        <Box 
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            gap="10px"
                        >
                            <Typography 
                                variant='h4' 
                                color={theme.palette.secondary[100]}
                            >
                                {singleUser?.firstName + " " + singleUser?.lastName}
                            </Typography>
                            <Typography 
                                variant='h6' 
                                color={theme.palette.mode === 'dark'? theme.palette.grey[300] : theme.palette.grey[700] }
                           
                            >
                                {singleUser?.role}
                            </Typography>
                        </Box>
                        <Box 
                            display="flex" 
                            justifyContent="space-around" 
                            alignItems="center" 
                            gap={2}
                            width="100%"
                        >
                            {singleUser && <IconButton
                                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                                sx={{ '&:hover': { color: theme.palette.error.dark } }}
                                onClick={()=>handleDelete(singleUser?._id)}
                            >
                                <DeleteIcon />
                            </IconButton>}
                            <IconButton
                                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                                sx={{ '&:hover': { color: theme.palette.primary.dark } }}
                                onClick={handleClickOpenEditForm}
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={7} height="100%">
                    <Box 
                        display="flex" 
                        flexDirection="column" 
                        gap="20px" 
                        justifyContent="space-around" 
                        alignItems="start" 
                        p={2}
                    >
                        <Typography 
                            variant='h3' 
                            color={theme.palette.secondary[100]}
                        >
                            Information
                        </Typography>
                        <Box 
                            width="100%" 
                            height="2px" 
                            bgcolor={theme.palette.primary.main} 
                            mb={2}
                        />
                        <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' color={theme.palette.secondary[100]} >Cin</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleUser?.cin}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' color={theme.palette.secondary[100]}>Email</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleUser?.email}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' color={theme.palette.secondary[100]}>Address</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleUser?.address}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' color={theme.palette.secondary[100]}>Phone Number</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleUser?.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' color={theme.palette.secondary[100]}>Registred At</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{formatDateString(singleUser?.createdAt)}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' color={theme.palette.secondary[100]}>Last Update</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{formatDateString(singleUser?.updatedAt)}</Typography>
                            </Grid>
                            {singleUser && singleUser.role !== 'superAdmin' && <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' color={theme.palette.secondary[100]}>Store</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleUser?.store?.storeName}</Typography>
                            </Grid>}
                            {singleUser && singleUser.role !== 'superAdmin' &&<Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4'color={theme.palette.secondary[100]}>Store Address</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[900] }}>{singleUser?.store?.address}</Typography>
                            </Grid>}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
      ) } </Box>
        
    );
};

export default UserProfile;
