import axios, { AxiosError } from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Dispatch } from 'redux';
import { AppThunk, RootState } from '../store';

import { userActions, UserType } from '../slices/userSlice';


const registerUser=(user:UserType):AppThunk<Promise<void>> =>{
    return async(dispatch:Dispatch)=>{
        try{
            await axios.post(`http://localhost:3001/api/auth/register`,user);
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

const getVendorsPerStore = (storeId:string):AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            const res = await axios.get(`http://localhost:3001/api/users/vendors/${storeId}`, {
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

const updateUser = (newUser:UserType,userId:string):AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            const res = await axios.put(`http://localhost:3001/api/users/${userId}`,newUser, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(userActions.updateUser(res.data));
            
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

const deleteUser= (userId:string):AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            await axios.delete(`http://localhost:3001/api/users/${userId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(userActions.deleteUser(userId));
            toast.success('Product deleted successfully');
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

export {getVendorsPerStore,updateUser,deleteUser,registerUser}