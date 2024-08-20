import { Box, Divider, LinearProgress, List, ListItem, ListItemText, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import { format } from 'date-fns';

import {  getSingleInvestment } from '../../apiCalls/investmentApiCall';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ProductType } from '../../slices/productSlice';


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
      renderCell: (params: GridRenderCellParams<ProductType>) => `${params.row.productName}`,
    },
    {
        field: 'Purchase Price',
        headerName: 'Purchase Price',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams<ProductType>) => `${params.row.purchasePrice}`,
      },
      {
        field: 'stockQuantity',
        headerName: 'Quantity',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams<ProductType>) => `${params.row.stockQuantity}`,
      },
  ];
const InvestmentDetails: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    //const navigate=useNavigate();
    const { id } = useParams();
    const { singleInvestment,isLoading } = useSelector((state: RootState) => state.investment);
   
    
    
    useEffect(() => {
        if (id) {
            dispatch(getSingleInvestment(id));
        }
    }, [id, dispatch]);
    
      
    const formatDateString = (dateString: Date | null | undefined) => {
        return dateString ? format(new Date(dateString), 'yyyy-MM-dd') : 'N/A';
    };

    return (
      <Box width="100%" height="100%">
            {isLoading ? (<Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>) :
           (<Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={5} p={3}>
          
            <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={2} width="100%">
       <Typography variant='h3' color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>Investment Informations</Typography>
       
       <List sx={{ ...style, mb: 3 }} aria-label="client details">
         <ListItem>
           <ListItemText primary="Investment Name : " />
           <Typography variant='body2'> {singleInvestment?.investmentName }</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Investment Amount : " />
           <Typography variant='body2'>{singleInvestment?.investmentAmount}</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Invested Amount : " />
           <Typography variant='body2'>{singleInvestment?.investedAmount}</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Gain : " />
           <Typography variant='body2'> {singleInvestment?.gain}</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Products Invested In Number : " />
           <Typography variant='body2'> {singleInvestment?.product.length}</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Created At: " />
           <Typography variant='body2'> {formatDateString(singleInvestment?.createdAt) }</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Updated At: " />
           <Typography variant='body2'> {formatDateString(singleInvestment?.updatedAt) }</Typography>
         </ListItem>
       </List>
       </Box>
       <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={2} width="100%">
       <Typography variant='h3' color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>Investor Informations</Typography>
       
       <List sx={{ ...style, mb: 3 }} aria-label="client details">
         <ListItem>
           <ListItemText primary="Investor Full Name : " />
           <Typography variant='body2'> {singleInvestment?.investor.firstName + ' ' +  singleInvestment?.investor.lastName}</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Investor cin : " />
           <Typography variant='body2'>{singleInvestment?.investor.cin}</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Investor Email :  " />
           <Typography variant='body2'>{singleInvestment?.investor.email}</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Investor Phone Number :  " />
           <Typography variant='body2'> {singleInvestment?.investor.phoneNumber}</Typography>
         </ListItem>
         <Divider component="li" />
         <ListItem>
           <ListItemText primary="Investor Address : " />
           <Typography variant='body2'> {singleInvestment?.investor.address}</Typography>
         </ListItem>
        
       </List>
       </Box>
       <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={2} width="100%">
       <Typography variant='h3' color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>Products List</Typography>
       <Box
         mt="40px"
         width="100%"
         height="75vh"
         sx={{
           '& .MuiDataGrid-root': {
             border: 'none',
             width: '100%', 
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
           rows={singleInvestment?.product || []  }
           columns={columns}
           getRowId={(row: ProductType) => row._id}
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
       </Box>) 
           }
            


        </Box>
        
    );
};

export default InvestmentDetails;
