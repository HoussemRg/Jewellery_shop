import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt: Date |null;
  updatedAt: Date | null;
  role:string
}
export interface StoreType{
  _id:string;
  storeName:string;
  description:string;
  address:string
}
export interface SingleUserType{
  _id: string;
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  role:string;
  store:StoreType
}
export interface UserState {
  users: UserType[];
  isUserCreated:boolean;
  isUserUpdated:boolean;
  isUserDeleted:boolean;
  singleUser:SingleUserType |null
}

const initialState: UserState = {
  users: [],
  isUserCreated:false,
  isUserUpdated:false,
  isUserDeleted:false,
  singleUser:null
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
    setIsUserUpdated:(state,action:PayloadAction<boolean>)=>{
      state.isUserUpdated=action.payload;
    },
    setIsUserDeleted:(state,action:PayloadAction<boolean>)=>{
      state.isUserDeleted=action.payload;
    },
    deleteUser:(state, action: PayloadAction<string>) => {
        state.users = state.users.filter((user) =>
          user._id !== action.payload 
        );
      },
    getSingleUser:(state,action:PayloadAction<SingleUserType>)=>{
      state.singleUser=action.payload;
    }
  },
});

const userActions = userSlice.actions;
const userReducer = userSlice.reducer;

export { userActions, userReducer };
