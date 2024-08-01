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

function App() {
  const mode=useSelector((state:RootState)=> state.theme.mode);
  const {user}=useSelector((state:RootState)=>state.auth);
 
  const theme=useMemo(()=> createTheme(themeSettings(mode as 'light' | 'dark')),[mode]);
  console.log(mode)
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer theme="colored" position="top-center" />
      <CssBaseline />
      <Routes>
        
        <Route path='/' element={<Home />} />
        <Route   element={<Layout />}>
          <Route  path='/dashboard' element={ user  ? <Dashboard /> : <Navigate to="/"  />} />
          <Route  path='/products' element={ user  ? <Products /> : <Navigate to="/"  />} />
          <Route  path='/vendors' element={ user  ? <Vendors /> : <Navigate to="/"  />} />
          <Route  path='/users/:id' element={<UserProfile />} />
          <Route path='/stores' element={ user && user?.role==='superAdmin' ? <Stores /> : <Navigate to="/"  />} />
          <Route  path='/stores/:id' element={<StoreDetails />} />

        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App
