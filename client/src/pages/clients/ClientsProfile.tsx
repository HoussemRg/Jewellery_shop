import { Box, Grid, IconButton, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import image from '../../assets/photo.png';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import { format } from 'date-fns';

import { userActions } from '../../slices/userSlice';
import { deleteClient, getSingleClient } from '../../apiCalls/clientApiCall';
import UpdateClientForm from '../../components/client/UpdateClientForm';

const ClientProfile: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate=useNavigate();
    const { id } = useParams();
    const { singleClient,isClientDeleted } = useSelector((state: RootState) => state.client);
    const [openEditForm, setOpenEditForm] = React.useState<boolean>(false);
    const handleClickOpenEditForm = () => {
        setOpenEditForm(true);
      };
      const handleCloseEditForm = () => {
        setOpenEditForm(false);
        if (id) {
            dispatch(getSingleClient(id));
        }
              
      };
    useEffect(() => {
        if (id) {
            dispatch(getSingleClient(id));
        }
    }, [id, dispatch]);
    const handleDelete = (id: string) => {
        dispatch(deleteClient(id));
        
      };
      useEffect(()=>{
        if(isClientDeleted){
            dispatch(userActions.setIsUserDeleted(false));
                navigate('/dashboard/clients');
        }
        
      })
    const formatDateString = (dateString: Date | null | undefined) => {
        return dateString ? format(new Date(dateString), 'yyyy-MM-dd') : 'N/A';
    };

    return (
        <Box 
            bgcolor={theme.palette.background.default} 
            height="100%" 
            p={2}
        >
            {singleClient && <UpdateClientForm handleCloseEditForm={handleCloseEditForm} opendEditForm={openEditForm} clientToUpdate={singleClient}   />}
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
                            
                            justifyContent="center"
                            alignItems="center"
                            gap="10px"
                        >
                            <Typography 
                                variant='h5' 
                                sx={{ color: theme.palette.primary.main }}
                            >
                                {singleClient?.firstName + " " + singleClient?.lastName}
                            </Typography>
                            
                        </Box>
                        <Box 
                            display="flex" 
                            justifyContent="space-around" 
                            alignItems="center" 
                            gap={2}
                            width="100%"
                        >
                            {singleClient && <IconButton
                                color="error"
                                sx={{ '&:hover': { color: theme.palette.error.dark } }}
                                onClick={()=>handleDelete(singleClient?._id)}
                            >
                                <DeleteIcon />
                            </IconButton>}
                            <IconButton
                                color="primary"
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
                            sx={{ color: theme.palette.primary.main }}
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
                                <Typography variant='h4' sx={{ color: theme.palette.grey[400] }}>Cin</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleClient?.cin}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' sx={{ color: theme.palette.grey[400] }}>Email</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleClient?.email}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' sx={{ color: theme.palette.grey[400] }}>Address</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleClient?.address}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' sx={{ color: theme.palette.grey[400] }}>Phone Number</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleClient?.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' sx={{ color: theme.palette.grey[400] }}>Registred At</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{formatDateString(singleClient?.createdAt)}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' sx={{ color: theme.palette.grey[400] }}>Last Update</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{formatDateString(singleClient?.updatedAt)}</Typography>
                            </Grid>
                            <Grid item xs={6} display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="start">
                                <Typography variant='h4' sx={{ color: theme.palette.grey[400] }}>Orders Number</Typography>
                                <Typography variant='h6' sx={{ color: theme.palette.grey[400] }}>{singleClient?.order.length}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ClientProfile;
