import {configureStore} from '@reduxjs/toolkit'
import { themeReducers, ThemeState } from './slices/themeSlice';
import { authReducers, UserState } from './slices/authSlice';
export type RootState = {
    theme: ThemeState;
    auth: {
        user: UserState | null 
      };

};

const store=configureStore({
    reducer:{
        theme:themeReducers,
        auth:authReducers
    }
})
export type AppDispatch = typeof store.dispatch;
export default store;