import { createSlice } from "@reduxjs/toolkit";



const storedUser = localStorage.getItem("user");
const initialState = storedUser ? JSON.parse(storedUser) : null;
export interface AuthState{
        user: UserLoggedInState | null;
    
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout:(state)=>{
            state.user=null
        }
    }
});

const authActions = authSlice.actions;
const authReducers = authSlice.reducer;

export interface UserLoggedInState {
    id: string;
    token: string;
    firstName: string;
    lastName: string;
    role: string;
    store:string
}

export { authActions, authReducers };