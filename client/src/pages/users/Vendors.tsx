import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, IconButton, useTheme, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import { deleteUser, getVendorsPerStore } from '../../apiCalls/userApiCall';
import { UserType } from '../../slices/userSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import VendorsHeader from '../../components/VendorsHeader';

const Vendors: React.FC = () => {
  const theme = useTheme();
  const { users } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      dispatch(getVendorsPerStore(user?.store));
    }
  }, [user, dispatch]);

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row selection
    dispatch(deleteUser(id));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((id: string) => dispatch(deleteUser(id)));
  };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Second Name', flex: 1 },
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
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <VendorsHeader />
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
      >
        <DataGrid
          rows={users}
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
        />
      </Box>
    </Box>
  );
};

export default Vendors;