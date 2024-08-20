import axios, { AxiosError } from 'axios';
import {  Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Dispatch } from 'redux';
import {  AppThunk, RootState } from '../store';
import { couponActions } from '../slices/couponSlice';
import { CouponData } from '../components/coupon/AddCouponForm';
import { CouponEditData } from '../components/coupon/UpdateCouponForm';

const createCoupon=(coupon:CouponData):AppThunk<Promise<void>> =>{
    let id: Id | undefined;
    return async(dispatch:Dispatch,getState)=>{
        id = toast.loading("Creeating  coupon, Please wait...");
        try{
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/coupons/create`,coupon,{
                headers:{
                    Authorization:"Bearer " + getState().auth.user?.token
                }
            });
            dispatch(couponActions.setIsCouponCreated(true));
            toast.update(id, { render: "Coupon created successfully", type: "success", isLoading: false, autoClose: 800 });
        }catch(err){
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }
        }
    }
}

const getAllCoupons = ():AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            dispatch(couponActions.setIsLoading(true));
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/coupons`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(couponActions.getAllCoupons(res.data));
            dispatch(couponActions.setIsLoading(false));
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

const getCouponPerType=(couponType:string):AppThunk<Promise<void>> => {
    return async (dispatch: Dispatch,getState: () => RootState) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/coupons/filter/${couponType}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(couponActions.getFilteredCoupons(res.data));
            
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


const getSingleCoupon=(couponId:string):AppThunk=> async(dispatch:Dispatch,getState)=>{
    try{
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/coupons/${couponId}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(couponActions.getSingleCoupon(res.data));
    }catch(err){
        const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 800 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 800 });
            }
    }
}

const updateCoupon = (newCoupon:Partial<CouponEditData>,couponId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("Updating  coupon, Please wait...");
        try {
            
            const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/coupons/${couponId}`,newCoupon, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(couponActions.updateCoupon(res.data));
            dispatch(couponActions.setIsCouponUpdated(true));
         
            toast.update(id, { render: "Coupon updated successfully", type: "success", isLoading: false, autoClose: 800 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }
        }
    }
}
const applyCoupon = (couponId:string,itemId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("applying  coupon, Please wait...");
        try {
            
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/coupons/apply/${couponId}/${itemId}`,{}, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            
            dispatch(couponActions.setIsCouponApplied(true));
         
            toast.update(id, { render: "Coupon applyied successfully", type: "success", isLoading: false, autoClose: 800 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }
        }
    }
}

const deleteCoupon= (couponId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("deleting  coupon, Please wait...");
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/coupons/${couponId}`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(couponActions.deleteCoupon(couponId));
            dispatch(couponActions.setIsCouponDeleted(true));
            toast.update(id, { render: "Coupon deleted successfully", type: "success", isLoading: false, autoClose: 800 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }
        }
    }
}

export {getAllCoupons,getSingleCoupon,deleteCoupon,updateCoupon,createCoupon,getCouponPerType,applyCoupon}