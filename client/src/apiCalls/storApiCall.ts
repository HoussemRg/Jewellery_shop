import axios, { AxiosError } from 'axios';
import {  Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Dispatch } from 'redux';
import { AppDispatch, AppThunk, RootState } from '../store';
import { storeActions } from '../slices/storeSlice';
import { StoreData } from '../components/store/AddStore';
import { StoreEditData } from '../components/store/UpdateStoreForm';


const createStore=(store:StoreData):AppThunk<Promise<void>> =>{
    let id: Id | undefined;
    return async(dispatch:Dispatch)=>{
        id = toast.loading("Creating  store, Please wait...");
        try{
            await axios.post(`http://localhost:3001/api/stores/create`,store);
            dispatch(storeActions.setIsStoreCreated(true));
            toast.update(id, { render: "Store updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        }catch(err){
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

const getAllStores = ():AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            const res = await axios.get(`http://localhost:3001/api/stores`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(storeActions.getAllStores(res.data.stores));
            
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
        }
    }
}

const getSingleStore=(storeId:string):AppThunk=> async(dispatch:AppDispatch,getState)=>{
    try{
        const res = await axios.get(`http://localhost:3001/api/stores/${storeId}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(storeActions.getSingleStore(res.data));
    }catch(err){
        const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
    }
}

const updateStore = (newStore:Partial<StoreEditData>,storeId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("Updating  store, Please wait...");
        try {
            
            const res = await axios.put(`http://localhost:3001/api/stores/${storeId}`,newStore, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(storeActions.updateStore(res.data));
            dispatch(storeActions.setIsStoreUpdated(true));
         
            toast.update(id, { render: "Store updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

const deleteStore= (storeId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("deleting  store, Please wait...");
        try {
            await axios.delete(`http://localhost:3001/api/stores/${storeId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(storeActions.deleteStore(storeId));
            dispatch(storeActions.setIsStoreDeleted(true));
            toast.update(id, { render: "Store deleted successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

export {getAllStores,updateStore,deleteStore,createStore,getSingleStore}