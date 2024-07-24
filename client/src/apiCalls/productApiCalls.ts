import axios,{AxiosError} from 'axios';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { productActions } from '../slices/productSlice';

type ThunkResult<R> = ThunkAction<R, RootState, unknown, never>;


const getAllProducts=(page:number):ThunkResult<Promise<void>>=>{
    return async(dispatch:Dispatch,getState)=>{
        try{
            const res=await axios.get(`http://localhost:3001/api/products?page=${page}`,{
                headers:{
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(productActions.getProducts(res.data));
            
        }catch(err:unknown){
            const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
              } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
              }
        }
    }
}


export {getAllProducts};