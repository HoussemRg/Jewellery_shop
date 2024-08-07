import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from '../../hooks';
import { RootState } from '../../store';
import { DataGrid, GridColDef, GridRenderCellParams,GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Button, IconButton, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { deleteCategory, getAllCategories } from '../../apiCalls/categoryApiCalls';
import { CategoryState } from '../../slices/categorySlice';
import CategoryHeader from '../../components/category/CategoryHeader';
import UpdateCategoryForm from '../../components/category/UpdateCategoryForm';

const Categories:React.FC = () => {
    const theme = useTheme();

    const {isCategoryDeleted,categories} =useSelector((state:RootState)=> state.category)

    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    useEffect(()=>{
      dispatch(getAllCategories());
    },[])
    useEffect(() => {
      if(!isCategoryDeleted) {
        dispatch(getAllCategories());
      }
    }, [ dispatch,isCategoryDeleted]);
  
    const handleDelete = (id: string, event: React.MouseEvent) => {
      event.stopPropagation();
      dispatch(deleteCategory(id));
      
      
    };
  
    const handleBulkDelete = () => {
      selectedRows.forEach((id: string) => dispatch(deleteCategory(id)));
    };
    const  [searchedCategory,setSearchedCategory]=useState<CategoryState>();
    
    const searchCategory=(id:string)=>{
      const searchedCategory=categories.find((category:CategoryState)=> category._id === id);
      if(searchedCategory){
        setSearchedCategory(searchedCategory);
        setOpenEditForm(true);
      }
    }
    const [openEditForm, setOpenEditForm] = React.useState<boolean>(false);
  
      const handleClickOpenEditForm = (id:string,event:React.MouseEvent) => {
        event.stopPropagation();
        searchCategory(id);
        
        
        
      };
      const handleCloseEditForm = () => {
        setOpenEditForm(false);
              
      };
      
    const columns: GridColDef[] = [
      { field: '_id', headerName: 'ID', flex: 1 },
      { field: 'categoryName', headerName: 'Category Name', flex: 1 },
      { field: 'categoryDescription', headerName: 'Category Description', flex: 1 },
      {field: 'productsCount' , headerName:'Products Number', flex:1},
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
            </Box>
          );
        },
      },
    ];
    const categoriesWithProductCount = categories.map(category => ({
        ...category,
        productsCount: category.product.length,
      }));
    return (
      <Box m="1.5rem 2.5rem">
        <CategoryHeader />
        {searchedCategory && <UpdateCategoryForm handleCloseEditForm={handleCloseEditForm} opendEditForm={openEditForm} categoryToUpdate={searchedCategory}   />}
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
            rows={categoriesWithProductCount}
            columns={columns}
            getRowId={(row: CategoryState) => row._id}
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

export default Categories
