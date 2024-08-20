import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { OrderDetailsType } from '../../slices/orderSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import { getSingleOrder } from '../../apiCalls/orderApiCall';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const style = {
  p: 2,
  width: '100%',
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};

const columns: GridColDef[] = [
  { field: '_id', headerName: 'ID', flex: 1, headerAlign: 'center', align: 'center' },
  {
    field: 'productName',
    headerName: 'Product Name',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params: GridRenderCellParams<OrderDetailsType>) => `${params.row.product.productName}`,
  },
  {
    field: 'category',
    headerName: 'Category',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params: GridRenderCellParams<OrderDetailsType>) => `${params.row.product.category.categoryName}`,
  },
  {
    field: 'subCategory',
    headerName: 'Sub-Category',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params: GridRenderCellParams<OrderDetailsType>) => `${params.row.product.subCategory.subCategoryName}`,
  },
  { field: 'quantity', headerName: 'Quantity', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'price', headerName: 'Price', flex: 1, headerAlign: 'center', align: 'center' },
];

const OrderDetails: React.FC = () => {
  const theme = useTheme();
  const { singleOrder ,isLoading} = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getSingleOrder(id));
    }
  }, [id, dispatch]);

  const formatDateString = (dateString: Date | null | undefined) => {
    return dateString ? format(new Date(dateString), 'yyyy-MM-dd') : 'N/A';
  };

  return (
    <Box width="100%" height="100%">
      {isLoading ? (<Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>) : (<Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={5} p={3}>
         <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={2} width="100%">
         <Typography variant='h3' color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>Order #{singleOrder?._id}</Typography>
      <List sx={{ ...style, mb: 3 }} aria-label="order details">
        <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={2}>
          
          <Typography color={singleOrder?.paymentStatus ? 'success.main' : 'error.main'}>
            {singleOrder?.paymentStatus ? 'Paid' : 'Not Paid'}
          </Typography>
          <Box display='flex' justifyContent="start" alignItems="center" gap={5}>
            <Typography>Total Amount: {singleOrder?.totalAmount}</Typography>
            <Typography>Placed on : {formatDateString(singleOrder?.createdAt)}</Typography>
            {singleOrder?.totalAmount && ((singleOrder?.totalAmount) - (singleOrder?.payedAmount)) > 0 && (
              <Typography>Amount left to pay: {(singleOrder?.totalAmount) - (singleOrder?.payedAmount)}</Typography>
            )}
          </Box>
        </Box>
      </List>
         </Box>
        

      <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={2} width="100%">
        <Typography variant='h3' color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>Client</Typography>
        <List sx={{ ...style, mb: 3 }} aria-label="client details">
          <ListItem>
            <ListItemText primary="Full Name: " />
            <Typography variant='body2'> {singleOrder?.client.firstName + " " + singleOrder?.client.lastName}</Typography>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="CIN: " />
            <Typography variant='body2'>{singleOrder?.client.cin}</Typography>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Email: " />
            <Typography variant='body2'>{singleOrder?.client.email}</Typography>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Address: " />
            <Typography variant='body2'> {singleOrder?.client.address}</Typography>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Phone Number: " />
            <Typography variant='body2'> {singleOrder?.client.phoneNumber}</Typography>
          </ListItem>
        </List>
      </Box>

      <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={2} width="100%">
        <Typography variant='h3' color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>Items Ordered</Typography>
        <Box
          mt="40px"
          width="100%"
          height="75vh"
          sx={{
            '& .MuiDataGrid-root': {
              
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
            rows={singleOrder?.orderDetails || []}
            columns={columns}
            getRowId={(row: OrderDetailsType) => row._id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            sx={{ width: '100%' }} 
          />
        </Box>
      </Box>
    </Box>)}
    </Box>
    
    
  );
};

export default OrderDetails;
