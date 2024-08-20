import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from '../../hooks';
import { RootState } from '../../store';
import { DataGrid, GridColDef, GridRenderCellParams,GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Button, IconButton, LinearProgress, Typography, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DiscountIcon from '@mui/icons-material/Discount';
import { deleteSubCategory, getAllSubCategories } from '../../apiCalls/subCategoryApiCalls';
import { SubCategoryState } from '../../slices/subCategorySlice';
import UpdateSubCategoryForm from '../../components/subCategories/SubCategoryUpdateForm';
import SubCategoryHeader from '../../components/subCategories/SubCategoryHeader';
import { getCouponPerType } from '../../apiCalls/couponApiCall';
import { couponActions } from '../../slices/couponSlice';
import ApplyCouonForm from '../../components/product/ApplyCouonForm';

const SubCategories:React.FC = () => {
    const theme = useTheme();

    const {isSubCategoryDeleted,subCategories,isLoading} =useSelector((state:RootState)=> state.subCategory)

    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const {filteredCoupons}=useSelector((state:RootState)=> state.coupon);

    useEffect(()=>{
      dispatch(getAllSubCategories());
    },[])
    useEffect(() => {
      if(!isSubCategoryDeleted) {
        dispatch(getAllSubCategories());
      }
    }, [ dispatch,isSubCategoryDeleted]);
  
    const handleDelete = (id: string, event: React.MouseEvent) => {
      event.stopPropagation();
      dispatch(deleteSubCategory(id));
      
      
    };
  
    const handleBulkDelete = () => {
      selectedRows.forEach((id: string) => dispatch(deleteSubCategory(id)));
    };
    const  [searchedSubCategory,setSearchedSubCategory]=useState<SubCategoryState>();
    
    const searchSubCategory=(id:string)=>{
      const searchedSubCategory=subCategories.find((subCategory:SubCategoryState)=> subCategory._id === id);
      if(searchedSubCategory){
        setSearchedSubCategory(searchedSubCategory);
        
      }
    }
    const [openEditForm, setOpenEditForm] = React.useState<boolean>(false);
    const [openCouponForm, setOpenCouponForm] = useState<boolean>(false);
      const handleClickOpenEditForm = (id:string,event:React.MouseEvent) => {
        event.stopPropagation();
        searchSubCategory(id);
        setOpenEditForm(true);
        
        
        
      };
      const handleCloseEditForm = () => {
        setOpenEditForm(false);
              
      };
      const handleOpenCouponForm=(id:string,event: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        event.stopPropagation();
        searchSubCategory(id);
        setOpenCouponForm(true);
      }
      const handleCloseCouponForm=(event?: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        if (event) event.stopPropagation();
        setOpenCouponForm(false);
      }
      useEffect(()=>{
        dispatch(couponActions.getFilteredCoupons([]));
        dispatch(getCouponPerType('subCategory'));
      },[]);
    const columns: GridColDef[] = [
      { field: '_id', headerName: 'ID', flex: 1 },
      { field: 'subCategoryName', headerName: 'Sub-Category Name', flex: 1 },
      { field: 'subCategoryDescription', headerName: 'Sub-Category Description', flex: 1 },
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
                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={(event) => handleClickOpenEditForm(params.row._id, event)}
                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
              >
                <EditIcon />
              </IconButton>
              {filteredCoupons.length>0 && <IconButton
                onClick={(event) => handleOpenCouponForm(params.row._id, event)}
                color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
              >
                <DiscountIcon />
              </IconButton>}
            </Box>
          );
        },
      },
    ];
    const subCategoriesWithProductCount = subCategories.map(subCategory => ({
        ...subCategory,
        productsCount: subCategory.product.length,
      }));
    return (
      <Box m="1.5rem 2.5rem">
        <SubCategoryHeader />
        {searchedSubCategory &&<ApplyCouonForm
          handleCloseCouponForm={handleCloseCouponForm}
          open={openCouponForm}
          FilteredCoupon={filteredCoupons}
          itemId={searchedSubCategory._id}
        />}
        {searchedSubCategory && <UpdateSubCategoryForm handleCloseEditForm={handleCloseEditForm} opendEditForm={openEditForm} subCategoryToUpdate={searchedSubCategory}   />}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="1rem">
          {selectedRows.length > 1 && (
            <Button
              variant="contained"
              color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
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
             subCategories.length>0 ?
              (<DataGrid
                rows={subCategoriesWithProductCount}
                columns={columns}
                getRowId={(row: SubCategoryState) => row._id}
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
                  <Typography>No Sub-Categories Yet</Typography>
                </Box>)
              }
          
        </Box>
      </Box>
    );
}

export default SubCategories
