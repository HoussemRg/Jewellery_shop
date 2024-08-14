import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ClientType {
  _id: string;
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt: Date |null;
  updatedAt: Date | null;
}
export interface OrderType{
    _id:string,
    totalAmount:number
}
export interface SingleClientType{
  _id: string;
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  order:OrderType[]
}
export interface ClientState {
  clients: ClientType[];
  isClientCreated:boolean;
  isClientUpdated:boolean;
  isClientDeleted:boolean;
  isLoading:boolean;
  singleClient:SingleClientType |null
}

const initialState: ClientState = {
  clients: [],
  isClientCreated:false,
  isClientUpdated:false,
  isClientDeleted:false,
  isLoading:false,
  singleClient:null
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    getAllClients: (state, action: PayloadAction<ClientType[]>) => {
      state.clients = action.payload;
    },
    setIsClientCreated:(state, action: PayloadAction<boolean>)=>{
        state.isClientCreated=action.payload;
    },
    updateClient: (state, action: PayloadAction<ClientType>) => {
      state.clients = state.clients.map((client) =>
        client._id === action.payload._id ? action.payload : client
      );
    },
    setIsClientUpdated:(state,action:PayloadAction<boolean>)=>{
      state.isClientUpdated=action.payload;
    },
    setIsClientDeleted:(state,action:PayloadAction<boolean>)=>{
      state.isClientDeleted=action.payload;
    },
    deleteClient:(state, action: PayloadAction<string>) => {
        state.clients = state.clients.filter((client) =>
            client._id !== action.payload 
        );
      },
    getSingleClient:(state,action:PayloadAction<SingleClientType>)=>{
      state.singleClient=action.payload;
    },
    setIsLoading:(state,action:PayloadAction<boolean>)=>{
      state.isLoading=action.payload;
    },
  },
});

const clientActions = clientSlice.actions;
const clientReducer = clientSlice.reducer;

export { clientActions, clientReducer };
