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
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import Categories from './pages/category/Categories';
import SubCategories from './pages/subCategories/SubCategories';

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
        <Route path='/admin-dashboard' element={user && user.role==='superAdmin' ? <SuperAdminDashboard /> : <Navigate to="/"  />} />
        <Route   element={<Layout />}>
          <Route  path='/dashboard/main' element={ user  ? <Dashboard /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/products' element={ user  ? <Products /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/categories' element={ user  ? <Categories /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/subCategories' element={ user  ? <SubCategories /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/vendors' element={ user  ? <Vendors /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/users/:id' element={<UserProfile />} />
          <Route path='/dashboard/stores' element={ user && user?.role==='superAdmin' ? <Stores /> : <Navigate to="/"  />} />
          <Route  path='/dashboard/stores/:id' element={<StoreDetails />} />
    
        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App
