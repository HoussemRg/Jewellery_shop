import axios,{AxiosError} from 'axios';
import { authActions } from '../slices/authSlice';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { AppDispatch, RootState } from '../store';

export interface AuthData {
    email: string;
    password: string;
  }


const loginUser=(user:AuthData)=> async(dispatch:AppDispatch)=>{
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
const regenerateTokenForSuperAdmin=(storeId:string)=>async(dispatch:AppDispatch,getState: () => RootState)=>{
  try{
      const res=await axios.post(`http://localhost:3001/api/auth/regenerate-token`,{storeId},{
        headers: {
            Authorization: "Bearer " + getState().auth.user?.token
        }
    });
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

export {loginUser,regenerateTokenForSuperAdmin};