import {CssBaseline,createTheme,ThemeProvider} from '@mui/material';
import {useSelector} from 'react-redux'
import { useMemo } from 'react';
import { themeSettings } from './theme';
import { RootState } from './store';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Layout from './pages/layout/Layout';
import Home from './pages/global/Home';

function App() {
  const mode=useSelector((state:RootState)=> state.theme.mode);
  const theme=useMemo(()=> createTheme(themeSettings(mode as 'light' | 'dark')),[mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/*home*/}
        <Route path='/' element={<Home />} />
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App
