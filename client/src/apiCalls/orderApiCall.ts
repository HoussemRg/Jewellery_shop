import axios, { AxiosError } from 'axios';
import { Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Dispatch } from 'redux';
import { AppDispatch, AppThunk, RootState } from '../store';
import { orderActions } from '../slices/orderSlice';
import { PaymentData } from '../components/order/PaymentForm';
import { OrderData } from '../components/Card/TopRightCard';

const getAllOrders = (): AppThunk => async (dispatch: AppDispatch, getState) => {
    try {
        const res = await axios.get(`http://localhost:3001/api/orders`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(orderActions.getAllOrders(res.data));
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response) {
            toast.error(error.response.data as string, { autoClose: 1200 });
        } else {
            toast.error('An unknown error occurred', { autoClose: 1200 });
        }
    }
};



const createOrder = (order: OrderData)=> async (dispatch: AppDispatch, getState: () => RootState) => {
        let id: Id | undefined;
        try {
           
            id = toast.loading("Creating order, Please wait...");
            
            await axios.post(`http://localhost:3001/api/orders/create`, order, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token,
                }
            });
            
            dispatch(orderActions.setIsOrderCreated(true));
            toast.update(id, { render: "Order created successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }




    const deleteOrder= (orderId:string):AppThunk<Promise<void>> => {
        let id: Id | undefined;
        return async (dispatch: Dispatch,getState: () => RootState) => {
            id = toast.loading("deleting  order, Please wait...");
            try {
                await axios.delete(`http://localhost:3001/api/orders/${orderId}`, {
                    headers: {
                        Authorization: "Bearer " + getState().auth.user?.token
                    }
                });
                dispatch(orderActions.deleteOrder(orderId));
                dispatch(orderActions.setIsOrderDeleted(true));
                toast.update(id, { render: "Order deleted successfully", type: "success", isLoading: false, autoClose: 1200 });
            } catch (err: unknown) {
                const error = err as AxiosError;
                if (id) {
                    toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
                }
            }
        }
    }

const payForOrder=(paymentAmount:PaymentData,orderId:string):AppThunk<Promise<void>> => {
    let id: Id | undefined;
    return async (dispatch: Dispatch,getState: () => RootState) => {
        id = toast.loading("paying order, Please wait...");
        try {
            
            const res = await axios.put(`http://localhost:3001/api/orders/${orderId}`,paymentAmount, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(orderActions.updateOrder(res.data));
            dispatch(orderActions.setIsOrderPaid(true));
         
            toast.update(id, { render: "Order payed successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }
}

const getSingleOrder=(orderId:string):AppThunk<Promise<void>>=> async(dispatch:Dispatch,getState:()=>RootState)=>{
    try{
        const res = await axios.get(`http://localhost:3001/api/orders/${orderId}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(orderActions.getSingleOrder(res.data));
    }catch(err){
        const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
    }
}
export { getAllOrders, getSingleOrder, createOrder ,deleteOrder,payForOrder };