import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, IconButton, useTheme, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Link } from 'react-router-dom';
import { deleteOrder, getAllOrders } from '../../apiCalls/orderApiCall';
import { OrderType } from '../../slices/orderSlice';
import OrderHeader from '../../components/order/OrderHeader';
import PaymentForm from '../../components/order/PaymentForm';
import PaymentIcon from '@mui/icons-material/Payment';

const Orders: React.FC = () => {
  const theme = useTheme();
  const { orders, isOrderDeleted } = useSelector((state: RootState) => state.order);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchedOrderId, setSearchedOrderId] = useState<string | null>(null);
  const [openPaymentForm, setOpenPaymentForm] = React.useState<boolean>(false);
  useEffect(()=>{
    dispatch(getAllOrders());
  },[])
  useEffect(() => {
    if (!isOrderDeleted) {
      dispatch(getAllOrders());
    }
  }, [user, dispatch, isOrderDeleted]);

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(deleteOrder(id));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((id: string) => dispatch(deleteOrder(id)));
  };

  const handleOpenPaymentForm = (orderId: string | null) => {
    if (orderId) {
      setOpenPaymentForm(true);
      setSearchedOrderId(orderId);
    }
  };

  const handleClosePaymentForm = () => {
    setOpenPaymentForm(false);
  };
 

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', flex: 1 },
    {
      field: 'clientFullName',
      headerName: 'Client Full Name',
      flex: 1,
      renderCell: (params: GridRenderCellParams<OrderType>) => `${params.row.client.firstName} ${params.row.client.lastName}`
    },
    { field: 'totalAmount', headerName: 'Total Amount', flex: 1 },
    {
      field: 'payedAmount',
      headerName: 'Payed Amount',
      flex: 1,
      renderCell: (params: GridRenderCellParams<OrderType>) => `${params.row.payedAmount} `
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams<OrderType>) => (
        <Box display="flex" alignItems="center" height="100%">
          {params.row.paymentStatus ? (
            <CheckCircleIcon color='success' sx={{  fontSize: 20 }} />
          ) : (
            <CancelIcon color='error' sx={{  fontSize: 20 }} />
          )}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridRenderCellParams<OrderType>) => {
        const { totalAmount, payedAmount, _id } = params.row;

    return (
      <Box>
        <IconButton
          onClick={(event) => handleDelete(_id, event)}
          color="secondary"
        >
          <DeleteIcon />
        </IconButton>
        
        <Link to={`/dashboard/orders/${_id}`}>
          <IconButton color="primary">
            <ListIcon />
          </IconButton>
        </Link>
        {payedAmount !== totalAmount && (
          <IconButton
            onClick={() => handleOpenPaymentForm(_id)}
            color="success"
          >
            <PaymentIcon />
          </IconButton>
        )}
      </Box>
    );
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <OrderHeader />
      {searchedOrderId && <PaymentForm handleClose={handleClosePaymentForm} open={openPaymentForm} orderId={searchedOrderId} />}
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
          rows={orders}
          columns={columns}
          getRowId={(row: OrderType) => row._id}
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

export default Orders;
