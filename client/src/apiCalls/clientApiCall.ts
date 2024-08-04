import axios, { AxiosError } from 'axios';
import {  Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Dispatch } from 'redux';
import {  AppThunk, RootState } from '../store';


import { clientActions } from '../slices/clientSlice';
import { ClientData } from '../components/client/AddClientForm';
import { ClientEditData } from '../components/client/UpdateClientForm';

const createClient=(client:ClientData):AppThunk<Promise<void>> =>{
    return async(dispatch:Dispatch,getState)=>{
        try{
            await axios.post(`http://localhost:3001/api/clients/create`,client,{
                headers:{
                    Authorization:"Bearer " + getState().auth.user?.token
                }
            });
            dispatch(clientActions.setIsClientCreated(true));
            toast.success('client added successfully');
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

const getAllClients = ():AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            const res = await axios.get(`http://localhost:3001/api/clients`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(clientActions.getAllClients(res.data.clients));
            
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

const getSingleClient=(clientId:string):AppThunk=> async(dispatch:Dispatch,getState)=>{
    try{
        const res = await axios.get(`http://localhost:3001/api/clients/${clientId}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(clientActions.getSingleClient(res.data));
    }catch(err){
        const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
    }
}

const updateClient = (newClient:Partial<ClientEditData>,userId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("Updating  user, Please wait...");
        try {
            
            const res = await axios.put(`http://localhost:3001/api/clients/${userId}`,newClient, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(clientActions.updateClient(res.data));
            dispatch(clientActions.setIsClientUpdated(true));
         
            toast.update(id, { render: "Client updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

const deleteClient= (clientId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("deleting  client, Please wait...");
        try {
            await axios.delete(`http://localhost:3001/api/clients/${clientId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(clientActions.deleteClient(clientId));
            dispatch(clientActions.setIsClientDeleted(true));
            toast.update(id, { render: "Client deleted successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

export {getAllClients,updateClient,deleteClient,getSingleClient,createClient}