import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, IconButton, useTheme, Button, Typography, useMediaQuery, LinearProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import { Link } from 'react-router-dom';
import { controlInvestmentsState, deleteInvestment, getAllInvestments } from '../../apiCalls/investmentApiCall';
import { InvestmentType } from '../../slices/investmentSlice';
import InvestmentHeader from '../../components/investment/InvestmentHeader';
import UpdateInvestmentForm from '../../components/investment/UpdateInvestmentForm';
import { format } from 'date-fns';

const Investments: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { investments, isInvestmentDeleted, isLoading } = useSelector((state: RootState) => state.investment);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    if (!isInvestmentDeleted) {
      dispatch(controlInvestmentsState());
      dispatch(getAllInvestments());
    }
  }, [user, dispatch, isInvestmentDeleted]);

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(deleteInvestment(id));
  };

  const formatDateString = (dateString: Date | null | undefined) => {
    return dateString ? format(new Date(dateString), 'yyyy-MM-dd') : 'N/A';
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((id: string) => dispatch(deleteInvestment(id)));
  };

  const [searchedInvestment, setSearchedInvestment] = useState<InvestmentType>();
  const searchInvestment = (id: string) => {
    const searchedInvestment = investments.find((investment: InvestmentType) => investment._id === id);
    if (searchedInvestment) {
      setSearchedInvestment(searchedInvestment);
      setOpenEditForm(true);
    }
  };

  const [openEditForm, setOpenEditForm] = React.useState<boolean>(false);

  const handleClickOpenEditForm = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    searchInvestment(id);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
  };

  const columns: GridColDef[] = [
    { field: 'investmentName', headerName: 'Investment Name', flex: 1 },
    {
      field: 'investorFullName',
      headerName: 'Investor Full Name',
      flex: 1,
      renderCell: (params: GridRenderCellParams<InvestmentType>) => `${params.row.investor.firstName} ${params.row.investor.lastName}`,
    },
    { 
      field: 'startDate', 
      headerName: 'Start Date', 
      flex: 1,
      renderCell: (params: GridRenderCellParams) => formatDateString(params.value as Date),
    },
    { 
      field: 'endDate', 
      headerName: 'End Date', 
      flex: 1,
      renderCell: (params: GridRenderCellParams) => formatDateString(params.value as Date),
    },
    { field: 'investmentAmount', headerName: 'Investment Amount ', flex: 1 },
    { field: 'investedAmount', headerName: 'Invested Amount ', flex: 1 },
    { field: 'gain', headerName: 'Gain ', flex: 1 },
    { field: 'investmentState', headerName: 'Investment State ', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <IconButton onClick={(event) => handleDelete(params.row._id, event)} color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(event) => handleClickOpenEditForm(params.row._id, event)} color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>
            <EditIcon />
          </IconButton>
          <Link to={`/dashboard/investments/${params.row._id}`}>
            <IconButton color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>
              <ListIcon />
            </IconButton>
          </Link>
        </Box>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <InvestmentHeader />
      {searchedInvestment && <UpdateInvestmentForm handleCloseEditForm={handleCloseEditForm} opendEditForm={openEditForm} investmentToUpdate={searchedInvestment} />}
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
        {isLoading ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ) : investments.length > 0 ? (
          <DataGrid
            rows={investments}
            columns={columns}
            getRowId={(row: InvestmentType) => row._id}
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
          />
        ) : (
          <Box width="100%" display="flex" justifyContent="center" alignItems="center" mt="100px">
            <Typography>No Investments yet</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Investments;
