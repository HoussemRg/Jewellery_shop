import axios, { AxiosError } from 'axios';
import { Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Action, Dispatch } from 'redux';
import { AppDispatch, AppThunk, RootState } from '../store';
import { productActions } from '../slices/productSlice';
import { ThunkAction } from 'redux-thunk';
import { FilterProductData } from '../components/product/FilterProducts';
type ThunkResult<R> = ThunkAction<R, RootState, unknown, Action<string>>;

const getAllProducts = (page: number): AppThunk => async (dispatch: AppDispatch, getState) => {
    try {
        const res = await axios.get(`http://localhost:3001/api/products?page=${page}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(productActions.getProducts(res.data));
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response) {
            toast.error(error.response.data as string, { autoClose: 1200 });
        } else {
            toast.error('An unknown error occurred', { autoClose: 1200 });
        }
    }
};

const getProductsNumber = (): AppThunk => async (dispatch:AppDispatch,getState) => {
        try {
            const res = await axios.get(`http://localhost:3001/api/products/count`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(productActions.getProductsNumber(res.data.count));
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
        }
    }


const createProduct = (product: FormData)=> async (dispatch: AppDispatch, getState: () => RootState) => {
        let id: Id | undefined;
        try {
            id = toast.loading("Creating product, Please wait...");
            await axios.post(`http://localhost:3001/api/products/create`, product, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token,
                    'Content-Type': "multipart/form-data"
                }
            });
            dispatch(getProductsNumber());
            dispatch(productActions.setIsProductCreated(true));
            toast.update(id, { render: "Product created successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }


const updateProduct = (product: FormData,productId:string):AppThunk  =>  async (dispatch: AppDispatch, getState) => {
        let id: Id | undefined;
        try {
            id = toast.loading("Updating product, Please wait...");
            const res=await axios.put(`http://localhost:3001/api/products/${productId}`, product, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token,
                    'Content-Type': "multipart/form-data"
                }
            });
            console.log(res.data);
            dispatch(productActions.updateProduct(res.data))
            dispatch(productActions.setIsProductUpdated(true));
            toast.update(id, { render: "Product updated successfully", type: "success", isLoading: false, autoClose: 1200 });
        } catch (err) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }
        }
    }


const deleteProduct=(id:string):AppThunk=> async(dispatch:AppDispatch,getState)=>{
        try{
            
            await axios.delete(`http://localhost:3001/api/products/${id}`,{
                headers:{
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(productActions.deleteProduct(id));
            dispatch(getProductsNumber());
            toast.success('Product deleted successfully')
        }catch(err){
            const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
            }
        }
    }


const getFilteredProducts=(params:Partial<FilterProductData>,page:number): ThunkResult<Promise<void>>=>{
    //let id: Id | undefined;
    return async(dispatch:Dispatch,getState)=>{
        //id = toast.loading("Searching products, Please wait...");
        try{
            const res=await axios.get(`http://localhost:3001/api/products/filter?page=${page}`,{params:params,headers:{
                Authorization: "Bearer " + getState().auth.user?.token
            }}
            )
            dispatch(productActions.getProductFiltered(res.data?.products));
            dispatch(productActions.getFilteredProductsCount(res.data?.count));
            dispatch(productActions.setIsProductsFiltered(true))
            //toast.update(id, { render: "Products filtered", type: "success", isLoading: false, autoClose: 1200 });
        }catch(err){
            /*const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 1200 });
            }*/
                const error = err as AxiosError;
                if (error.response) {
                    toast.error(error.response.data as string, { autoClose: 1200 });
                } else {
                    toast.error('An unknown error occurred', { autoClose: 1200 });
                }
        }
    }
}
export { getAllProducts, getProductsNumber, createProduct ,deleteProduct,updateProduct,getFilteredProducts };