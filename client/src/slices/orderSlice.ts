import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientType } from "./clientSlice";
import { ProductType } from "./productSlice";

export interface OrderType {
  _id: string;
  client:  Pick<ClientType, '_id' | 'firstName' | 'lastName'>;
  totalAmount: string;
  paymentStatus: string;
  payedAmount: string;
  createdAt:Date | null;
  updatedAt:Date | null;
}

export interface OrderDetailsType{
    _id:string;
    price:number;
    quantity:number;
    product: Pick<ProductType, '_id' | 'productName' | 'description'|'carat' | 'weight' | 'unitPrice' | 'category' | 'subCategory' | 'stockQuantity'>
}

export interface SingleOrderType{
    _id: string;
    orderDetails:  OrderDetailsType[];
    client: Pick<ClientType, '_id' | 'firstName' | 'lastName' | 'cin' | 'email'>;
    totalAmount: string;
    paymentStatus: string;
    payedAmount: string;
    createdAt:Date | null;
    updatedAt:Date | null;
}
export interface OrderState {
  orders: OrderType[];
  isOrderCreated:boolean;
  isOrderUpdated:boolean;
  isOrderDeleted:boolean;
  singleOrder:SingleOrderType |null
}

const initialState: OrderState = {
  orders: [],
  isOrderCreated:false,
  isOrderUpdated:false,
  isOrderDeleted:false,
  singleOrder:null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    getAllOrders: (state, action: PayloadAction<OrderType[]>) => {
      state.orders = action.payload;
    },
    setIsOrderCreated:(state, action: PayloadAction<boolean>)=>{
        state.isOrderCreated=action.payload;
    },
    updateOrder: (state, action: PayloadAction<OrderType>) => {
      state.orders = state.orders.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );
    },
    setIsOrderUpdated:(state,action:PayloadAction<boolean>)=>{
      state.isOrderUpdated=action.payload;
    },
    setIsOrderDeleted:(state,action:PayloadAction<boolean>)=>{
      state.isOrderDeleted=action.payload;
    },
    deleteOrder:(state, action: PayloadAction<string>) => {
        state.orders = state.orders.filter((order) =>
            order._id !== action.payload 
        );
      },
    getSingleOrder:(state,action:PayloadAction<SingleOrderType>)=>{
      state.singleOrder=action.payload;
    }
  },
});

const orderActions = orderSlice.actions;
const orderReducer = orderSlice.reducer;

export { orderActions, orderReducer };
