import axios, { AxiosError } from 'axios';
import {  Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Dispatch } from 'redux';
import {  AppThunk, RootState } from '../store';


import { investmentActions } from '../slices/investmentSlice';
import { InvestmentData } from '../components/investment/AddInvestmentForm';
import { InvestmentEditData } from '../components/investment/UpdateInvestmentForm';

const createInvestment=(investment:InvestmentData):AppThunk<Promise<void>> =>{
    let id: Id | undefined;
    return async(dispatch:Dispatch,getState)=>{
        id = toast.loading("Creating  Investment, Please wait...");
        try{
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/investments/create`,investment,{
                headers:{
                    Authorization:"Bearer " + getState().auth.user?.token
                }
            });
            dispatch(investmentActions.setIsInvestmentCreated(true));

            toast.update(id, { render: "Investment updated successfully", type: "success", isLoading: false, autoClose: 1200 });

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

const getAllInvestments = ():AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            dispatch(investmentActions.setIsLoading(true));
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/investments`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(investmentActions.getAllInvestments(res.data));
            dispatch(investmentActions.setIsLoading(false));
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

const getAllInvestmentsPerInvestor = (investorId:string):AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            dispatch(investmentActions.setIsLoading(true));
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/investments/investor/${investorId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(investmentActions.getAllInvestments(res.data));
            dispatch(investmentActions.setIsLoading(false));
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

const controlInvestmentsState = ():AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/investments/status`,{}, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
         

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

const getSingleInvestment=(investmentId:string):AppThunk=> async(dispatch:Dispatch,getState)=>{
    try{
        dispatch(investmentActions.setIsLoading(true));
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/investments/${investmentId}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(investmentActions.getSingleInvestment(res.data));
        dispatch(investmentActions.setIsLoading(false));
    }catch(err){
        const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
    }
}

const updateInvestment = (newInvestment:Partial<InvestmentEditData>,userId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("Updating  user, Please wait...");
        try {
            
            const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/investments/${userId}`,newInvestment, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(investmentActions.updateInvestment(res.data));
            dispatch(investmentActions.setIsInvestmentUpdated(true));
         
            toast.update(id, { render: "Investment updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

const deleteInvestment= (investmentId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("deleting  investment, Please wait...");
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/investments/${investmentId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(investmentActions.deleteInvestment(investmentId));
            dispatch(investmentActions.setIsInvestmentDeleted(true));
            toast.update(id, { render: "Investment deleted successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

export {getAllInvestments,updateInvestment,deleteInvestment,getSingleInvestment,createInvestment,getAllInvestmentsPerInvestor,controlInvestmentsState}