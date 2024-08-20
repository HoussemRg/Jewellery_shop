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
        dispatch(productActions.setIsLoading(true));

        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products?page=${page}`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(productActions.getProducts(res.data));
        dispatch(productActions.setIsLoading(false));

    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response) {
            toast.error(error.response.data as string, { autoClose: 800 });
        } else {
            toast.error('An unknown error occurred', { autoClose: 800 });
        }
    }
};

const getAllProductsList = (): AppThunk => async (dispatch: AppDispatch, getState) => {
    try {
        

        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products/all`, {
            headers: {
                Authorization: "Bearer " + getState().auth.user?.token
            }
        });
        dispatch(productActions.getAllProducts(res.data));


    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response) {
            toast.error(error.response.data as string, { autoClose: 800 });
        } else {
            toast.error('An unknown error occurred', { autoClose: 800 });
        }
    }
};

const getProductsNumber = (): AppThunk => async (dispatch:AppDispatch,getState) => {
        try {
            dispatch(productActions.setIsLoadingFullDashboard(true));
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products/count`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(productActions.getProductsNumber(res.data.count));
            dispatch(productActions.setIsLoadingFullDashboard(false));
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 800 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 800 });
            }
        }
    }

    const getTopProductsSales = (): AppThunk => async (dispatch:AppDispatch,getState) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products/top`, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token
                }
            });
            dispatch(productActions.getTopProducts(res.data));
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 800 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 800 });
            }
        }
    }



const createProduct = (product: FormData)=> async (dispatch: AppDispatch, getState: () => RootState) => {
        let id: Id | undefined;
        try {
            id = toast.loading("Creating product, Please wait...");
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/products/create`, product, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token,
                    'Content-Type': "multipart/form-data"
                }
            });
            dispatch(getProductsNumber());
            dispatch(productActions.setIsProductCreated(true));
            toast.update(id, { render: "Product created successfully", type: "success", isLoading: false, autoClose: 800 });
        } catch (err) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }
        }
    }


const updateProduct = (product: FormData,productId:string):AppThunk  =>  async (dispatch: AppDispatch, getState) => {
        let id: Id | undefined;
        try {
            id = toast.loading("Updating product, Please wait...");
            const res=await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`, product, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user?.token,
                    'Content-Type': "multipart/form-data"
                }
            });
            console.log(res.data);
            dispatch(productActions.updateProduct(res.data))
            dispatch(productActions.setIsProductUpdated(true));
            toast.update(id, { render: "Product updated successfully", type: "success", isLoading: false, autoClose: 800 });
        } catch (err) {
            const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }
        }
    }


const deleteProduct=(id:string):AppThunk=> async(dispatch:AppDispatch,getState)=>{
        try{
            
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/products/${id}`,{
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
                toast.error(error.response.data as string, { autoClose: 800 });
            } else {
                toast.error('An unknown error occurred', { autoClose: 800 });
            }
        }
    }


const getFilteredProducts=(params:Partial<FilterProductData>,page:number): ThunkResult<Promise<void>>=>{
    //let id: Id | undefined;
    return async(dispatch:Dispatch,getState)=>{
        //id = toast.loading("Searching products, Please wait...");
        try{
            

            const res=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products/filter?page=${page}`,{params:params,headers:{
                Authorization: "Bearer " + getState().auth.user?.token
            }}
            )
            dispatch(productActions.getProductFiltered(res.data?.products));
            dispatch(productActions.getFilteredProductsCount(res.data?.count));
            dispatch(productActions.setIsProductsFiltered(true))
          

            //toast.update(id, { render: "Products filtered", type: "success", isLoading: false, autoClose: 800 });
        }catch(err){
            /*const error = err as AxiosError;
            if (id) {
                toast.update(id, { render: String(error?.response?.data) || 'An unknown error occurred', type: "error", isLoading: false, autoClose: 800 });
            }*/
                const error = err as AxiosError;
                if (error.response) {
                    toast.error(error.response.data as string, { autoClose: 800 });
                } else {
                    toast.error('An unknown error occurred', { autoClose: 800 });
                }
        }
    }
}
export { getAllProducts, getProductsNumber, createProduct ,deleteProduct,updateProduct,getFilteredProducts,getTopProductsSales ,getAllProductsList};