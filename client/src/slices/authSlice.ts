import { createSlice } from "@reduxjs/toolkit";



const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:null
    },
    reducers:{
        login:(state,action)=>{
            state.user=action.payload
        }
    }
});

const authActions=authSlice.actions;
const authReducers=authSlice.reducer;
export interface UserState{
    id:string,
    token:string,
    firstName:string,
    lastName:string,
    role:string
}
export {authActions,authReducers}