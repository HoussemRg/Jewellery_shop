import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel  } from '@mui/x-data-grid';
import { Box, IconButton, useTheme, Button, Typography, useMediaQuery, LinearProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


import { deleteCoupon, getAllCoupons } from '../../apiCalls/couponApiCall';
import { CouponType } from '../../slices/couponSlice';
import CouponHeader from '../../components/coupon/CouponHeader';
import UpdateCouponForm from '../../components/coupon/UpdateCouponForm';
import { format } from 'date-fns';

const Coupons: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { coupons, isCouponDeleted,isLoading } = useSelector((state: RootState) => state.coupon);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();


  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    if (!isCouponDeleted) {
      dispatch(getAllCoupons());
    }
  }, [user, dispatch, isCouponDeleted]);

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(deleteCoupon(id));
  };

  

  const handleBulkDelete = () => {
    selectedRows.forEach((id: string) => dispatch(deleteCoupon(id)));
  };

  const [searchedCoupon, setSearchedCoupon] = useState<CouponType>();
  const searchCoupon = (id: string) => {
    const searchedCoupon = coupons.find((coupon: CouponType) => coupon._id === id);
    if (searchedCoupon) {
      setSearchedCoupon(searchedCoupon);
      setOpenEditForm(true);
    }
  };

  const [openEditForm, setOpenEditForm] = React.useState<boolean>(false);

  const handleClickOpenEditForm = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    searchCoupon(id);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
  };
  const formatDateString = (dateString: Date | null | undefined) => {
    return dateString ? format(new Date(dateString), 'yyyy-MM-dd') : 'N/A';
};


  const columns: GridColDef[] = [
    { field: 'couponName', headerName: 'Coupon Name', flex: 1 },
    { 
        field: 'startDate', 
        headerName: 'Start Date', 
        flex: 1,
        renderCell: (params: GridRenderCellParams) => formatDateString(params.value as Date),
      },
      { 
        field: 'expirationDate', 
        headerName: 'Expiration Date', 
        flex: 1,
        renderCell: (params: GridRenderCellParams) => formatDateString(params.value as Date),
      },
      { field: 'type', headerName: 'Type', flex: 0.5 },
    { field: 'discountRate', headerName: 'Discount Rate (%)', flex: 1 },
    { 
        field: 'createdAt', 
        headerName: 'Created At', 
        flex: 1,
        renderCell: (params: GridRenderCellParams) => formatDateString(params.value as Date),
      },
      { 
        field: 'updatedAt', 
        headerName: 'Updated At', 
        flex: 1,
        renderCell: (params: GridRenderCellParams) => formatDateString(params.value as Date),
      },
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
          
          
        </Box>
      ),
    },
  ];

 

 
  
  return (
    <Box m="1.5rem 2.5rem">
      <CouponHeader />
      {searchedCoupon && <UpdateCouponForm handleCloseEditForm={handleCloseEditForm} opendEditForm={openEditForm} couponToUpdate={searchedCoupon} />}
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
        { isLoading ?
        (<Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>) :
         coupons.length > 0 ?
          (<DataGrid
            rows={coupons}
            columns={columns}
            getRowId={(row: CouponType) => row._id}
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
          />)
          : 
          (<Box width="100%" display="flex" justifyContent="center" alignItems="center" mt="100px">
            <Typography>No Coupons yet</Typography>
          </Box>)
          }
        
      </Box>
    </Box>
  );
};

export default Coupons;
