import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserState {
  users: UserType[];
  isUserCreated:boolean
}

const initialState: UserState = {
  users: [],
  isUserCreated:false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getAllVendorsPerStore: (state, action: PayloadAction<UserType[]>) => {
      state.users = action.payload;
    },
    setIsUserCreated:(state, action: PayloadAction<boolean>)=>{
        state.isUserCreated=action.payload;
    },
    updateUser: (state, action: PayloadAction<UserType>) => {
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    },
    deleteUser:(state, action: PayloadAction<string>) => {
        state.users = state.users.filter((user) =>
          user._id !== action.payload 
        );
      },
  },
});

const userActions = userSlice.actions;
const userReducer = userSlice.reducer;

export { userActions, userReducer };
