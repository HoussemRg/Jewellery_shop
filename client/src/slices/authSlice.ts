import { createSlice } from "@reduxjs/toolkit";



const storedUser = localStorage.getItem("user");
const initialUserState = storedUser ? JSON.parse(storedUser) : null;

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: initialUserState
    },
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