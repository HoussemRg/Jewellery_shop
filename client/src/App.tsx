import {CssBaseline,createTheme,ThemeProvider} from '@mui/material';
import {useSelector} from 'react-redux'
import { useMemo } from 'react';
import { themeSettings } from './theme';
import { RootState } from './store';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Layout from './pages/layout/Layout';
import Home from './pages/global/Home';
import { ToastContainer } from 'react-toastify';
import Products from './pages/products/Products';
import Vendors from './pages/users/Vendors';
import UserProfile from './pages/users/UserProfile';
import Stores from './pages/stores/Stores';
import StoreDetails from './pages/stores/StoreDetails';
import Categories from './pages/category/Categories';
import SubCategories from './pages/subCategories/SubCategories';
import Clients from './pages/clients/Clients';
import ClientProfile from './pages/clients/ClientsProfile';
import Orders from './pages/order/Orders';
import OrderDetails from './pages/order/OrderDetails';
import Coupons from './pages/coupons/Coupons';
import Users from './pages/users/Users';
import EmailVerification from './pages/global/EmailVerification';
import SuperAdminLayout from './pages/layout/SuperAdminLayout';
import Investors from './pages/investor/investors';
import InvestorProfile from './pages/investor/investorProfile';
import Investments from './pages/investment/Investments';
import InvestmentDetails from './pages/investment/InvestmentDetails';
import InvestmentsPerInvestor from './pages/investment/InvestmentsPerInvestor';


function App() {
  const mode=useSelector((state:RootState)=> state.theme.mode);
  const {user}=useSelector((state:RootState)=>state.auth);
 
  const theme=useMemo(()=> createTheme(themeSettings(mode as 'light' | 'dark')),[mode]);
  
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer theme="colored" position="top-center" />
      <CssBaseline />
      <Routes>
        
        <Route path='/' element={<Home />} />
        <Route
          path="/users/:userId/verify/:token"
          element={<EmailVerification /> }
        />
        <Route   element={<SuperAdminLayout />}>
          <Route path='/admin-dashboard' element={user && user.role==='superAdmin' && <Stores />} />
          <Route  path='/admin-dashboard/users' element={ user  && user.role==='superAdmin' && <Users />} />
        </Route>
       
        <Route   element={<Layout />}>
          <Route  path='/dashboard/main' element={ user && user.role!=='vendor'  ? <Dashboard /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/products' element={ user  ? <Products /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/categories' element={ user  ? <Categories /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/subCategories' element={ user  ? <SubCategories /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/vendors' element={ user  ? <Vendors /> : <Navigate to="/"  />} />      
          <Route  path='/dashboard/users/:id' element={ user  ?<UserProfile /> :<Navigate to="/"  /> } />
          <Route  path='/dashboard/clients' element={ user  ? <Clients /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/coupons' element={ user  ? <Coupons /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/clients/:id' element={ user  ?<ClientProfile />:<Navigate to="/"  />} />
          <Route  path='/dashboard/stores/:id' element={<StoreDetails />} />
          <Route path='/dashboard/orders' element={ user ? <Orders /> : <Navigate to="/"  />} />
          <Route path='/dashboard/orders/:id' element={ user ? <OrderDetails /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/investors' element={ user  ? <Investors /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/investors/:id' element={ user  ? <InvestorProfile /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/investments' element={ user  ? <Investments /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/investments/:id' element={ user  ? <InvestmentDetails /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/investments/investor/:investorId' element={ user  ? <InvestmentsPerInvestor /> : <Navigate to="/"  />} />
        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App
