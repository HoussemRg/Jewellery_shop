import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
    mode: 'light' | 'dark';
}

const initialState: ThemeState = {
    mode: 'light', 
};
const themeSlice=createSlice({
    name:'theme',
    initialState,
    reducers:{
        setMode:(state)=>{
            state.mode= state.mode==='light' ? 'dark' : 'light'
        }
    }
})

const themeActions=themeSlice.actions;
const themeReducers=themeSlice.reducer;

export {themeActions,themeReducers};