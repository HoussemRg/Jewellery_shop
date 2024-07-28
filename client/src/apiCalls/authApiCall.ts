import axios,{AxiosError} from 'axios';
import { authActions } from '../slices/authSlice';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';

export interface AuthData {
    email: string;
    password: string;
  }
  type ThunkResult<R> = ThunkAction<R, RootState, unknown, never>;

const loginUser=(user:AuthData):  ThunkResult<Promise<void>>=>{
    return async(dispatch:Dispatch): Promise<void> =>{
        try{
            
            const res=await axios.post(`http://localhost:3001/api/auth/login`,user);
            
            dispatch(authActions.login(res.data));
            localStorage.setItem("user",JSON.stringify(res.data))
        }catch (err:unknown) {
            const error = err as AxiosError;
            if (error.response) {
                toast.error(error.response.data as string, { autoClose: 1200 });
              } else {
                toast.error('An unknown error occurred', { autoClose: 1200 });
              }
          }
    }
}

export {loginUser};