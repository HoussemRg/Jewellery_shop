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
    return async(dispatch:Dispatch,getState: () => RootState)=>{
        id = toast.loading("Creating  store, Please wait...");
        try{
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/stores/create`,store,{
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(storeActions.setIsStoreCreated(true));
            toast.update(id, { render: "Store created successfully", type: "success", isLoading: false, autoClose: 800 });
        }catch(err){
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }
        }
    }
}

const getAllStores = ():AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            dispatch(storeActions.setIsLoading(true));

            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/stores`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(storeActions.getAllStores(res.data.stores));
            dispatch(storeActions.setIsLoading(false));

        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 800 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 800 });
            }
        }
    }
}

const getSingleStore=(storeId:string):AppThunk=> async(dispatch:AppDispatch,getState)=>{
    try{
        dispatch(storeActions.setIsLoading(true));
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/stores/${storeId}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(storeActions.getSingleStore(res.data));
        dispatch(storeActions.setIsLoading(false));
    }catch(err){
        const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 800 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 800 });
            }
    }
}

const updateStore = (newStore:Partial<StoreEditData>,storeId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("Updating  store, Please wait...");
        try {
            
            const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/stores/${storeId}`,newStore, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(storeActions.updateStore(res.data));
            dispatch(storeActions.setIsStoreUpdated(true));
         
            toast.update(id, { render: "Store updated successfully", type: "success", isLoading: false, autoClose: 800 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }
        }
    }
}

const deleteStore= (storeId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("deleting  store, Please wait...");
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/stores/${storeId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(storeActions.deleteStore(storeId));
            dispatch(storeActions.setIsStoreDeleted(true));
            toast.update(id, { render: "Store deleted successfully", type: "success", isLoading: false, autoClose: 800 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }
        }
    }
}

export {getAllStores,updateStore,deleteStore,createStore,getSingleStore}