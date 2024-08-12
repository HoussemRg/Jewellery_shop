import axios, { AxiosError } from 'axios';
import {  Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Dispatch } from 'redux';
import {  AppThunk, RootState } from '../store';

import { userActions } from '../slices/userSlice';
import { UserData } from '../components/user/AddUserForm';
import { UserEditData } from '../components/user/UpdateUserForm';


const registerUser=(user:UserData):AppThunk<Promise<void>> =>{
    return async(dispatch:Dispatch)=>{
        try{
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`,user);
            dispatch(userActions.setIsUserCreated(true));
            toast.success('user added successfully');
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

const getVendorsPerStore = ():AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/vendors`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(userActions.getAllVendorsPerStore(res.data.users));
            
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

const getSingleUser=(userId:string):AppThunk<Promise<void>>=> async(dispatch:Dispatch,getState:()=>RootState)=>{
    try{
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(userActions.getSingleUser(res.data));
    }catch(err){
        const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
    }
}

const updateUser = (newUser:Partial<UserEditData>,userId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("Updating  user, Please wait...");
        try {
            
            const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`,newUser, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(userActions.updateUser(res.data));
            dispatch(userActions.setIsUserUpdated(true));
         
            toast.update(id, { render: "User updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

const deleteUser= (userId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("deleting  user, Please wait...");
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(userActions.deleteUser(userId));
            dispatch(userActions.setIsUserDeleted(true));
            toast.update(id, { render: "User deleted successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

export {getVendorsPerStore,updateUser,deleteUser,registerUser,getSingleUser}