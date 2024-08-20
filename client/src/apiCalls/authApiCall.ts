import axios,{AxiosError} from 'axios';
import { authActions } from '../slices/authSlice';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {  Dispatch } from 'redux';
import { AppDispatch, AppThunk, RootState } from '../store';
import { productActions } from '../slices/productSlice';
import { subCategoryActions } from '../slices/subCategorySlice';
import { categoryActions } from '../slices/categorySlice';
import { clientActions } from '../slices/clientSlice';
import { orderActions } from '../slices/orderSlice';
import { cardActions } from '../slices/cardSlice';
import { userActions } from '../slices/userSlice';

export interface AuthData {
    email: string;
    password: string;
  }


const loginUser=(user:AuthData)=> async(dispatch:AppDispatch)=>{
      try{
          dispatch(authActions.setIsLoading(true));
          const res=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`,user);
          
          dispatch(authActions.login(res.data));
          localStorage.setItem("user",JSON.stringify(res.data))
          dispatch(authActions.setIsLoading(false));
      }catch (err:unknown) {
          const error = err as AxiosError;
          if (error.response) {
              toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
              toast.error('An unknown error occurred', { autoClose: 1200 });
            }
        }
      }
const regenerateTokenForSuperAdmin=(storeId:string, callback: () => void)=>async(dispatch:AppDispatch,getState: () => RootState)=>{
  try{
      const res=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/regenerate-token`,{storeId},{
        headers: {
            Authorization: "Bearer " + getState().auth.user?.token
        }
    });
      dispatch(authActions.login(res.data));
      localStorage.setItem("user",JSON.stringify(res.data));
      dispatch(productActions.getProducts([]));
        dispatch(productActions.getProductsNumber(0));
        dispatch(productActions.resetFiltredProducts());
        dispatch(categoryActions.getAllCategories([]));
        dispatch(subCategoryActions.getAllSubCategories([]));
        dispatch(clientActions.getAllClients([]));
        dispatch(orderActions.getAllOrders([]));
        dispatch(cardActions.clearProductsList());
        dispatch(userActions.getAllVendorsPerStore([]));
        
        dispatch(productActions.resetFiltredProductsCount());
        callback();
  }catch (err:unknown) {
      const error = err as AxiosError;
      if (error.response) {
          toast.error(error.response.data as string, { autoClose: 1200 });
        } else {
          toast.error('An unknown error occurred', { autoClose: 1200 });
        }
    }
  }

  const verifyEmail=(userId:string,token:string):AppThunk<Promise<void>>=>{
    return async (dispatch:Dispatch)=>{
      try{
        dispatch(authActions.setIsLoading(true));
          const res=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/${userId}/verify/${token}`);
          dispatch(authActions.verifyEmail());
          toast.success(res.data,{autoClose:1200})
          dispatch(authActions.setIsLoading(false));
      }catch(err){
        const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
      }
    }
  }

export {loginUser,regenerateTokenForSuperAdmin,verifyEmail};