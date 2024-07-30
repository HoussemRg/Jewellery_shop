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

function App() {
  const mode=useSelector((state:RootState)=> state.theme.mode);
  const user=useSelector((state:RootState)=>state.auth.user);
  
  const theme=useMemo(()=> createTheme(themeSettings(mode as 'light' | 'dark')),[mode]);
  
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

        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App
