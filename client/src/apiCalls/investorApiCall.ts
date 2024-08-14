import axios, { AxiosError } from 'axios';
import {  Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Dispatch } from 'redux';
import {  AppThunk, RootState } from '../store';


import { investorActions } from '../slices/investorSlice';
import { InvestorData } from '../components/investor/AddInvestorForm';
import { InvestorEditData } from '../components/investor/UpdateInvestorForm';

const createInvestor=(investor:InvestorData):AppThunk<Promise<void>> =>{
    return async(dispatch:Dispatch,getState)=>{
        try{
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/investors/create`,investor,{
                headers:{
                    Authorization:"Bearer " + getState().auth.user?.token
                }
            });
            dispatch(investorActions.setIsInvestorCreated(true));

            toast.success('investor added successfully');
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

const getAllInvestors = ():AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            dispatch(investorActions.setIsLoading(true));
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/investors`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(investorActions.getAllInvestors(res.data.investors));
            dispatch(investorActions.setIsLoading(false));
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

const getSingleInvestor=(investorId:string):AppThunk=> async(dispatch:Dispatch,getState)=>{
    try{
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/investors/${investorId}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(investorActions.getSingleInvestor(res.data));
    }catch(err){
        const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
    }
}

const updateInvestor = (newInvestor:Partial<InvestorEditData>,userId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("Updating  user, Please wait...");
        try {
            
            const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/investors/${userId}`,newInvestor, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(investorActions.updateInvestor(res.data));
            dispatch(investorActions.setIsInvestorUpdated(true));
         
            toast.update(id, { render: "Investor updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

const deleteInvestor= (investorId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("deleting  investor, Please wait...");
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/investors/${investorId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(investorActions.deleteInvestor(investorId));
            dispatch(investorActions.setIsInvestorDeleted(true));
            toast.update(id, { render: "Investor deleted successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

export {getAllInvestors,updateInvestor,deleteInvestor,getSingleInvestor,createInvestor}