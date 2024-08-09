import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, IconButton, useTheme, Button, Typography, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import { Link, useNavigate } from 'react-router-dom';
import { deleteClient, getAllClients } from '../../apiCalls/clientApiCall';
import { ClientType } from '../../slices/clientSlice';
import ClientHeader from '../../components/client/ClientHeader';
import UpdateClientForm from '../../components/client/UpdateClientForm';
import { cardActions } from '../../slices/cardSlice';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

const Clients: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { clients, isClientDeleted } = useSelector((state: RootState) => state.client);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    if (!isClientDeleted) {
      dispatch(getAllClients());
    }
  }, [user, dispatch, isClientDeleted]);

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(deleteClient(id));
  };

  const handleCreateCard = (clientId: string) => {
    dispatch(cardActions.setClientId(clientId));
    navigate('/dashboard/products');
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((id: string) => dispatch(deleteClient(id)));
  };

  const [searchedClient, setSearchedClient] = useState<ClientType>();
  const searchClient = (id: string) => {
    const searchedClient = clients.find((client: ClientType) => client._id === id);
    if (searchedClient) {
      setSearchedClient(searchedClient);
      setOpenEditForm(true);
    }
  };

  const [openEditForm, setOpenEditForm] = React.useState<boolean>(false);

  const handleClickOpenEditForm = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    searchClient(id);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
  };

  const smallScreenColumns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={(event) => handleDelete(params.row._id, event)} color="secondary">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(event) => handleClickOpenEditForm(params.row._id, event)} color="success">
            <EditIcon />
          </IconButton>
          <Link to={`/dashboard/clients/${params.row._id}`}>
            <IconButton color='primary'>
              <ListIcon />
            </IconButton>
          </Link>
          <IconButton color='primary' onClick={() => handleCreateCard(params.row._id)}>
            <AddShoppingCartOutlinedIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const mediumScreenColumns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={(event) => handleDelete(params.row._id, event)} color="secondary">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(event) => handleClickOpenEditForm(params.row._id, event)} color="success">
            <EditIcon />
          </IconButton>
          <Link to={`/dashboard/clients/${params.row._id}`}>
            <IconButton color='primary'>
              <ListIcon />
            </IconButton>
          </Link>
          <IconButton color='primary' onClick={() => handleCreateCard(params.row._id)}>
            <AddShoppingCartOutlinedIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const largeScreenColumns: GridColDef[] = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={(event) => handleDelete(params.row._id, event)} color="secondary">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(event) => handleClickOpenEditForm(params.row._id, event)} color="success">
            <EditIcon />
          </IconButton>
          <Link to={`/dashboard/clients/${params.row._id}`}>
            <IconButton color='primary'>
              <ListIcon />
            </IconButton>
          </Link>
          <IconButton color='primary' onClick={() => handleCreateCard(params.row._id)}>
            <AddShoppingCartOutlinedIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const getColumns = () => {
    if (isSmallScreen) {
      return smallScreenColumns;
    }
    if (isMediumScreen) {
      return mediumScreenColumns;
    }
    return largeScreenColumns;
  };

  return (
    <Box m="1.5rem 2.5rem">
      <ClientHeader />
      {searchedClient && <UpdateClientForm handleCloseEditForm={handleCloseEditForm} opendEditForm={openEditForm} clientToUpdate={searchedClient} />}
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
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            color: theme.palette.text.primary,
            padding: isSmallScreen ? '4px' : '8px',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderBottom: '1px solid',
            borderBottomColor: theme.palette.divider,
            fontSize: isSmallScreen ? '0.75rem' : '1rem',
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
      >
        {clients.length > 0 ? (
          <DataGrid
            rows={clients}
            columns={getColumns()}
            getRowId={(row: ClientType) => row._id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: isSmallScreen ? 3 : 5,
                },
              },
            }}
            pageSizeOptions={[3, 5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
              setSelectedRows(newSelection as string[]);
            }}
          />
        ) : (
          <Box width="100%" display="flex" justifyContent="center" alignItems="center" mt="100px">
            <Typography>No Clients yet</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Clients;
