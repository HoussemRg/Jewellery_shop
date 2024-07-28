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
        }
    }
});

const authActions = authSlice.actions;
const authReducers = authSlice.reducer;

export interface UserState {
    id: string;
    token: string;
    firstName: string;
    lastName: string;
    role: string;
}

export { authActions, authReducers };