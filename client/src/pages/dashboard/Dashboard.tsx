import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, useTheme, Select, MenuItem, LinearProgress } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getGain, getGainPerYear } from '../../apiCalls/gainApiCall';
import { getAllOrders, getOrdersNumber } from '../../apiCalls/orderApiCall';
import { getClientsNumber } from '../../apiCalls/clientApiCall';
import { getProductsNumber, getTopProductsSales } from '../../apiCalls/productApiCalls';
import getMonthlyOrderCounts from '../../utils/getOrdersMonthlyCount';
import { getCategoriesNumber, getTopCategories } from '../../apiCalls/categoryApiCalls';
import { getSubCategoriesNumber, getTopSubCategories } from '../../apiCalls/subCategoryApiCalls';
import { SelectChangeEvent } from '@mui/material/Select'; // Import the SelectChangeEvent type
import { getVendorsNumber } from '../../apiCalls/userApiCall';
import { getInvestorsNumber } from '../../apiCalls/investorApiCall';

const Dashboard = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const thisYear = new Date().getFullYear();
    const [year, setYear] = useState(thisYear);
    const [ordersData, setOrdersData] = useState<{ name: string, count: number }[]>([]);
    const { vendorsNumber } = useSelector((state: RootState) => state.user);
    const { gain, gainPerYear,availableYears,isLoading } = useSelector((state: RootState) => state.gain);
    const { ordersNumber, orders } = useSelector((state: RootState) => state.order);
    const { clientsNumber } = useSelector((state: RootState) => state.client);
    const { productsCount, topProducts,isLoadingFullDahsboard } = useSelector((state: RootState) => state.product);
    const { investorsNumber } = useSelector((state: RootState) => state.investor);
    const { topCategories,categoryNumber } = useSelector((state: RootState) => state.category);
    const { topSubCategories,subCategoryNumber } = useSelector((state: RootState) => state.subCategory);


    useEffect(() => {
        dispatch(getGain());
        dispatch(getAllOrders());
        dispatch(getOrdersNumber());
        dispatch(getClientsNumber());
        dispatch(getProductsNumber());
        dispatch(getTopProductsSales());
        dispatch(getTopCategories());
        dispatch(getTopSubCategories());
        dispatch(getCategoriesNumber());
        dispatch(getSubCategoriesNumber());
        dispatch(getVendorsNumber());
        dispatch(getInvestorsNumber());
    }, [dispatch]);

    useEffect(() => {
        if (orders.length > 0) {
            const monthlyData = getMonthlyOrderCounts(orders, thisYear);
            setOrdersData(monthlyData);
        }
    }, [orders, thisYear]);

    useEffect(() => {
        dispatch(getGainPerYear(year.toString()));
    }, [year, dispatch]);

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        const selectedYear = Number(event.target.value);
        setYear(selectedYear);
        dispatch(getGainPerYear(selectedYear.toString()));
    };

    const pieData = [
        { name: 'Product A', value: 400 },
        { name: 'Product B', value: 300 },
        { name: 'Product C', value: 300 },
        { name: 'Product D', value: 200 },
    ];
    const COLORS = [
        '#ff5722',
        '#FFD700',
        '#ce93d8',
        '#8A2BE2',
        '#FF6347',
        '#2196f3',
        '#4682B4',
        '#32CD32',
        '#607d8b',
        '#FF1493',
    ];

    return (
        <Box p={2}>
            {isLoadingFullDahsboard ?  (<Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>) : productsCount>0 ?
           (<Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">Total Revenue</Typography>
                        <Typography variant="h4">${gain?.gain}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">Total Customers</Typography>
                        <Typography variant="h4">{clientsNumber}</Typography> 
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">Total Orders</Typography>
                        <Typography variant="h4">{ordersNumber}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">Total Products</Typography>
                        <Typography variant="h4">{productsCount}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">Total Categories</Typography>
                        <Typography variant="h4">{categoryNumber}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">Total Sub-Categories</Typography>
                        <Typography variant="h4">{subCategoryNumber}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">Total Vendors</Typography>
                        <Typography variant="h4">{vendorsNumber}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary">Total Investors</Typography>
                        <Typography variant="h4">{investorsNumber}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={8}>
                <Card>
                {!isLoading ? (
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" gutterBottom>Revenue Growth</Typography>
                                    <Select
                                        value={year}
                                        onChange={handleYearChange}
                                        variant="outlined"
                                        size="small"
                                        style={{ width: 100 }}
                                    >
                                        {availableYears.map(i => (
                                            <MenuItem key={i} value={i}>
                                                { i}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <LineChart width={600} height={300} data={gainPerYear}>
                                <Line 
                                    type="monotone" 
                                    dataKey="gain" 
                                    stroke={theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.secondary.main} 
                                    />
                                    <CartesianGrid stroke={theme.palette.divider} />
                                    <XAxis dataKey="month" stroke={theme.palette.text.primary} />
                                    <YAxis stroke={theme.palette.text.primary} />
                                    <Tooltip />
                                </LineChart>
                            </CardContent>
                        ) : (
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress />
                            </Box>
                        )}
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Orders by Month</Typography>
                        <BarChart width={300} height={300} data={ordersData}>
                            <Bar dataKey="count" fill={theme.palette.secondary.main} />
                            <XAxis dataKey="name" stroke={theme.palette.text.primary} />
                            <YAxis stroke={theme.palette.text.primary} />
                            <Tooltip />
                        </BarChart>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={topProducts}
                                cx={150}
                                cy={150}
                                innerRadius={60}
                                outerRadius={80}
                                fill={theme.palette.primary.main}
                                paddingAngle={5}
                                dataKey="totalQuantitySold"
                                nameKey="productName"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Top Selling Categories</Typography>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={topCategories}
                                cx={150}
                                cy={150}
                                innerRadius={60}
                                outerRadius={80}
                                fill={theme.palette.primary.main}
                                paddingAngle={5}
                                dataKey="totalQuantitySold"
                                nameKey="categoryName"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Top Selling Sub-Categories</Typography>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={topSubCategories}
                                cx={150}
                                cy={150}
                                innerRadius={60}
                                outerRadius={80}
                                fill={theme.palette.primary.main}
                                paddingAngle={5}
                                dataKey="totalQuantitySold"
                                nameKey="subCategoryName"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>) 
           : 
           (<Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>) }
            </Box>
       
        
    );
};

export default Dashboard;
