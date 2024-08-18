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
  role:string;
  isAccountVerified:boolean
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
  store:StoreType;
  isAccountVerified:boolean;
}
export interface UserState {
  users: UserType[];
  vendorsNumber:number;
  isUserCreated:boolean;
  isUserUpdated:boolean;
  isUserDeleted:boolean;
  isLoading:boolean;
  singleUser:SingleUserType |null
}

const initialState: UserState = {
  users: [],
  vendorsNumber:0,
  isUserCreated:false,
  isUserUpdated:false,
  isUserDeleted:false,
  isLoading:false,
  singleUser:null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getAllVendorsPerStore: (state, action: PayloadAction<UserType[]>) => {
      state.users = action.payload;
    },
    getVendorsNumber: (state, action: PayloadAction<number>) => {
      state.vendorsNumber = action.payload;
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
    setIsLoading:(state,action:PayloadAction<boolean>)=>{
      state.isLoading=action.payload;
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
