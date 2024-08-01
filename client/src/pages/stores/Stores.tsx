import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from '../../hooks';
import { RootState } from '../../store';
import { DataGrid, GridColDef, GridRenderCellParams,GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Button, IconButton, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import StoresHeader from '../../components/StoresHeader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteStore, getAllStores } from '../../apiCalls/storApiCall';
import { StoreOriginalType } from '../../slices/storeSlice';
import ListIcon from '@mui/icons-material/List';
import UpdateStoreForm from '../../components/UpdateStoreForm';


const Stores:React.FC = () => {
    const theme = useTheme();
   
    const {isStoreDeleted,stores} =useSelector((state:RootState)=> state.store)

    const dispatch = useDispatch();
  
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
    useEffect(() => {
      if(!isStoreDeleted) {
        dispatch(getAllStores());
      }
    }, [ dispatch,isStoreDeleted]);
  
    const handleDelete = (id: string, event: React.MouseEvent) => {
      event.stopPropagation();
      dispatch(deleteStore(id));
      
      
    };
  
    const handleBulkDelete = () => {
      selectedRows.forEach((id: string) => dispatch(deleteStore(id)));
    };
    const  [searchedStore,setSearchedStore]=useState<StoreOriginalType>();
    
    const searchStore=(id:string)=>{
      const searchedStore=stores.find((store:StoreOriginalType)=> store._id === id);
      if(searchedStore){
        setSearchedStore(searchedStore);
        setOpenEditForm(true);
      }
    }
    const [openEditForm, setOpenEditForm] = React.useState<boolean>(false);
  
      const handleClickOpenEditForm = (id:string,event:React.MouseEvent) => {
        event.stopPropagation();
        searchStore(id);
        
        
        
      };
      const handleCloseEditForm = () => {
        setOpenEditForm(false);
              
      };
    const columns: GridColDef[] = [
      { field: '_id', headerName: 'ID', flex: 1 },
      { field: 'storeName', headerName: 'Store Name', flex: 1 },
      { field: 'address', headerName: 'Address', flex: 1 },
      
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
              <Link to={`/stores/${params.row._id}`}
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
        <StoresHeader />
        {searchedStore && <UpdateStoreForm handleCloseEditForm={handleCloseEditForm} opendEditForm={openEditForm} storeToUpdate={searchedStore}   />}
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
            rows={stores}
            columns={columns}
            getRowId={(row: StoreOriginalType) => row._id}
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
}

export default Stores
