import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, IconButton, useTheme, Button, Typography, LinearProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import { deleteUser, getVendorsPerStore } from '../../apiCalls/userApiCall';
import {  UserType } from '../../slices/userSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import VendorsHeader from '../../components/VendorsHeader';
import EditIcon from '@mui/icons-material/Edit';
import UpdateUserForm from '../../components/user/UpdateUserForm';
import ListIcon from '@mui/icons-material/List';
import { Link } from 'react-router-dom';

const Vendors: React.FC = () => {
  const theme = useTheme();
  const { users,isUserDeleted ,isLoading} = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(()=>{
    if (user && user.store) {
      dispatch(getVendorsPerStore());
    }
  },[user])

  useEffect(() => {
    if (user && user.store &&  !isUserDeleted) {
      dispatch(getVendorsPerStore());
    }
  }, [dispatch,isUserDeleted]);

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(deleteUser(id));
    
    
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((id: string) => dispatch(deleteUser(id)));
  };
  const  [searchedUser,setSearchedUser]=useState<UserType>();
  const searchUser=(id:string)=>{
    const searchedUser=users.find((user:UserType)=> user._id === id);
    if(searchedUser){
      setSearchedUser(searchedUser);
      setOpenEditForm(true);
    }
  }
  const [openEditForm, setOpenEditForm] = React.useState<boolean>(false);

    const handleClickOpenEditForm = (id:string,event:React.MouseEvent) => {
      event.stopPropagation();
      searchUser(id);
      
      
      
    };
    const handleCloseEditForm = () => {

      setOpenEditForm(false);
      if (user && user.store) {
        dispatch(getVendorsPerStore());
      }
            
    };
  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'cin', headerName: 'CIN', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box>
            <IconButton
              onClick={(event) => handleDelete(params.row._id, event)}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={(event) => handleClickOpenEditForm(params.row._id, event)}
              color="success"
            >
              <EditIcon />
            </IconButton>
            <Link to={`/dashboard/users/${params.row._id}`}
            >
              <IconButton color='primary'>
                <ListIcon />
              </IconButton>
              
            </Link>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <VendorsHeader />
      {searchedUser && <UpdateUserForm handleCloseEditForm={handleCloseEditForm} opendEditForm={openEditForm} userToUpdate={searchedUser}   />}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="1rem">
        {selectedRows.length > 1 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBulkDelete}
            startIcon={<DeleteIcon />}
          >
            Delete Selected
          </Button>
        )}
      </Box>
      <Box
        mt="40px"
        height="75vh"  
      >
        {isLoading ?
         (<Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>)
          : 
          users.length>0 ? 
          ( <DataGrid
            rows={users.filter((user)=>user.role !== 'admin' && user.role !== 'superAdmin')}
            columns={columns}
            getRowId={(row: UserType) => row._id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
              setSelectedRows(newSelection as string[]);
            }}
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: 'none',
                color: theme.palette.text.primary,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                borderBottom: '1px solid',
                borderBottomColor: theme.palette.divider,
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: theme.palette.background.paper,
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                borderTop: '1px solid',
                borderTopColor: theme.palette.divider,
              },
              '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                color: theme.palette.primary.main,
              },
              '& .MuiCheckbox-root': {
                color: theme.palette.primary.main,
              },
              '& .MuiDataGrid-row.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                color: theme.palette.common.white,
              },
              '& .MuiDataGrid-cell--withRenderer.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                color: theme.palette.common.white,
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '& .MuiDataGrid-cell--withRenderer.MuiDataGrid-cell--editing': {
                backgroundColor: theme.palette.action.selected,
                color: theme.palette.common.white,
              },
            }}
          />) 
          : 
          (<Box width="100%" display="flex" justifyContent="center" alignItems="center" mt="100px">
            <Typography>No Vendors yet </Typography>
            </Box>)}
        
      </Box>
    </Box>
  );
};

export default Vendors;
