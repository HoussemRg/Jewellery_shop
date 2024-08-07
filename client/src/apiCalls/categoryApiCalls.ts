import axios, { AxiosError } from 'axios';
import {  Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppDispatch, AppThunk, RootState } from '../store';
import { categoryActions } from '../slices/categorySlice';
import { CategoryEditData } from '../components/category/UpdateCategoryForm';
import { CategoryData } from '../components/category/AddCategoryForm';
type ThunkResult<R> = ThunkAction<R, RootState, unknown, Action>;
const getAllCategories=():ThunkResult<Promise<void>> =>{
    return async(dispatch:Dispatch,getState)=>{
        try{
            const res= await axios.get('http://localhost:3001/api/categories',{
                headers:{
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            })
            dispatch(categoryActions.getAllCategories(res.data?.categoryies));
            dispatch(categoryActions.getCategoryNumber(res.data?.count));
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

const createCategory=(category:CategoryData):AppThunk<Promise<void>> =>{
    let id: Id | undefined;
    return async(dispatch:AppDispatch,getState:()=>RootState)=>{
        id = toast.loading("Creating  store, Please wait...");
        try{
            await axios.post(`http://localhost:3001/api/categories/create`,category,{
                headers:{
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(categoryActions.setIsCategoryCreated(true));
            toast.update(id, { render: "Category updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        }catch(err){
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}


const updateCategory = (newCategory:Partial<CategoryEditData>,categoryId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("Updating  store, Please wait...");
        try {
            
            const res = await axios.put(`http://localhost:3001/api/categories/${categoryId}`,newCategory, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(categoryActions.updateCategory(res.data));
            dispatch(categoryActions.setIsCategoryUpdated(true));
         
            toast.update(id, { render: "Category updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

const deleteCategory= (categoryId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("deleting  category, Please wait...");
        try {
            await axios.delete(`http://localhost:3001/api/categories/${categoryId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(categoryActions.deleteCategory(categoryId));
            dispatch(categoryActions.setIsCategoryDeleted(true));
            toast.update(id, { render: "Category deleted successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}


export {getAllCategories,createCategory,updateCategory,deleteCategory}