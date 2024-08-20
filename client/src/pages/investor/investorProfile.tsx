import { Box, Divider, LinearProgress, List, ListItem, ListItemText, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import { format } from 'date-fns';

import {  getSingleInvestor } from '../../apiCalls/investorApiCall';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { InvestmentType } from '../../slices/investorSlice';

const formatDateString = (dateString: Date | null | undefined) => {
    return dateString ? format(new Date(dateString), 'yyyy-MM-dd') : 'N/A';
  };
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
      field: 'investmentName',
      headerName: 'Investment Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<InvestmentType>) => `${params.row.investmentName}`,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<InvestmentType>) => `${ formatDateString(params.row.startDate)}`,
    },
    {
        field: 'endDate',
        headerName: 'End Date',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams<InvestmentType>) => `${formatDateString(params.row.endDate) }`,
      },
    {
      field: 'investmentState',
      headerName: 'Investment State',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<InvestmentType>) => `${params.row.investmentState}`,
    },
    {
        field: 'investmentAmount',
        headerName: 'Investment Amount',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams<InvestmentType>) => `${params.row.investmentAmount}`,
      },
      {
        field: 'investedAmount',
        headerName: 'Invested Amount',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams<InvestmentType>) => `${params.row.investedAmount}`,
      },
      {
        field: 'gain',
        headerName: 'Gain',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams<InvestmentType>) => `${params.row.gain}`,
      },
  ];
const InvestorProfile: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    //const navigate=useNavigate();
    const { id } = useParams();
    const { singleInvestor,isLoading } = useSelector((state: RootState) => state.investor);
   
    
    
    useEffect(() => {
        if (id) {
            dispatch(getSingleInvestor(id));
        }
    }, [id, dispatch]);
    
      
    const formatDateString = (dateString: Date | null | undefined) => {
        return dateString ? format(new Date(dateString), 'yyyy-MM-dd') : 'N/A';
    };

    return (
      <Box width="100%" height="100%">
      {isLoading ? (<Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>) :  <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={5} p={3}>
          
          <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={2} width="100%">
     <Typography variant='h3' color="primary">Investor Informations</Typography>
     
     <List sx={{ ...style, mb: 3 }} aria-label="client details">
       <ListItem>
         <ListItemText primary="Full Name: " />
         <Typography variant='body2'> {singleInvestor?.firstName + " " + singleInvestor?.lastName}</Typography>
       </ListItem>
       <Divider component="li" />
       <ListItem>
         <ListItemText primary="CIN: " />
         <Typography variant='body2'>{singleInvestor?.cin}</Typography>
       </ListItem>
       <Divider component="li" />
       <ListItem>
         <ListItemText primary="Email: " />
         <Typography variant='body2'>{singleInvestor?.email}</Typography>
       </ListItem>
       <Divider component="li" />
       <ListItem>
         <ListItemText primary="Address: " />
         <Typography variant='body2'> {singleInvestor?.address}</Typography>
       </ListItem>
       <Divider component="li" />
       <ListItem>
         <ListItemText primary="Phone Number: " />
         <Typography variant='body2'> {singleInvestor?.phoneNumber}</Typography>
       </ListItem>
       <Divider component="li" />
       <ListItem>
         <ListItemText primary="Created At: " />
         <Typography variant='body2'> {formatDateString(singleInvestor?.createdAt) }</Typography>
       </ListItem>
       <Divider component="li" />
       <ListItem>
         <ListItemText primary="Updated At: " />
         <Typography variant='body2'> {formatDateString(singleInvestor?.updatedAt) }</Typography>
       </ListItem>
     </List>
     </Box>
     <Box display='flex' flexDirection="column" justifyContent="center" alignItems="start" gap={2} width="100%">
     <Typography variant='h3' color="primary">Investments List</Typography>
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
         rows={singleInvestor?.investment || []  }
         columns={columns}
         getRowId={(row: InvestmentType) => row._id}
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
     </Box>}
    </Box>
    
       
    );
};

export default InvestorProfile;
