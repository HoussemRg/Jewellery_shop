import axios, { AxiosError } from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { subCategoryActions } from '../slices/subCategorySlice';
type ThunkResult<R> = ThunkAction<R, RootState, unknown, Action>;
const getAllSubCategories=():ThunkResult<Promise<void>> =>{
    return async(dispatch:Dispatch,getState)=>{
        try{
            const res= await axios.get('http://localhost:3001/api/subcategories',{
                headers:{
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            })
            dispatch(subCategoryActions.getAllSubCategories(res.data?.subCategories));
            dispatch(subCategoryActions.getSubCategoryNumber(res.data?.count));
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

export {getAllSubCategories}