import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserLoggedInState {
    id: string;
    token: string;
    firstName: string;
    lastName: string;
    role: string;
    store:string
}

export interface AuthState{
    user: UserLoggedInState |null;

}
const storedUser = localStorage.getItem("user");
const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserLoggedInState>) => {
            state.user = action.payload;
        },
        setStoreIdForSuperAdmin:(state,action: PayloadAction<string>)=>{
            if (state.user) {
                state.user.store = action.payload;
            }
        },
        logout:(state)=>{
            state.user=null;
            localStorage.removeItem('user');
        }
    }
});

const authActions = authSlice.actions;
const authReducers = authSlice.reducer;



export { authActions, authReducers };