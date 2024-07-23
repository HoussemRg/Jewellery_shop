import {configureStore} from '@reduxjs/toolkit'
import { themeReducers, ThemeState } from './slices/themeSlice';
export type RootState = {
    theme: ThemeState;
};

const store=configureStore({
    reducer:{
        theme:themeReducers
    }
})

export default store;