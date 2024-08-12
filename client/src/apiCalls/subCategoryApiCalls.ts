import axios, { AxiosError } from 'axios';
import {  Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {  AppThunk, RootState } from '../store';
import { subCategoryActions } from '../slices/subCategorySlice';
import { SubCategoryData } from '../components/subCategories/SubCategoryAddForm';
import { SubCategoryEditData } from '../components/subCategories/SubCategoryUpdateForm';
type ThunkResult<R> = ThunkAction<R, RootState, unknown, Action>;
const getAllSubCategories=():ThunkResult<Promise<void>> =>{
    return async(dispatch:Dispatch,getState)=>{
        try{
            const res= await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/subcategories`,{
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


const createSubCategory=(subCategory:SubCategoryData):AppThunk<Promise<void>> =>{
    let id: Id | undefined;
    return async(dispatch:Dispatch,getState:()=>RootState)=>{
        id = toast.loading("Creating  Sub-Category, Please wait...");
        try{
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/subCategories/create`,subCategory,{
                headers:{
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(subCategoryActions.setIsSubCategoryCreated(true));
            toast.update(id, { render: "SubC-ategory updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        }catch(err){
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}
const updateSubCategory = (newSubCategory:Partial<SubCategoryEditData>,subCategoryId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("Updating  Sub-Category, Please wait...");
        try {
            
            const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/subCategories/${subCategoryId}`,newSubCategory, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(subCategoryActions.updateSubCategory(res.data));
            dispatch(subCategoryActions.setIsSubCategoryUpdated(true));
         
            toast.update(id, { render: "Sub-Category updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}
const deleteSubCategory= (subCategoryId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("deleting  category, Please wait...");
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/subCategories/${subCategoryId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(subCategoryActions.deleteSubCategory(subCategoryId));
            dispatch(subCategoryActions.setIsSubCategoryDeleted(true));
            toast.update(id, { render: "Sub-Category deleted successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}


export {getAllSubCategories,createSubCategory,updateSubCategory,deleteSubCategory}