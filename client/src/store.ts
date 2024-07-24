import {configureStore} from '@reduxjs/toolkit'
import { themeReducers, ThemeState } from './slices/themeSlice';
import { authReducers, UserState } from './slices/authSlice';
import { productReducers, ProductState } from './slices/productSlice';
export type RootState = {
    theme: ThemeState;
    auth: {
        user: UserState | null 
      };
    product:{
        products: ProductState[] | []
    }
};

const store=configureStore({
    reducer:{
        theme:themeReducers,
        auth:authReducers,
        product:productReducers
    }
})
export type AppDispatch = typeof store.dispatch;
export default store;