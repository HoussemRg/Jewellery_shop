import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "./productSlice";
import { CategoryState } from "./categorySlice";
import { SubCategoryState } from "./subCategorySlice";

export interface CouponType {
  _id: string;
  couponName: string;
  startDate: Date;
  expirationDate: Date;
  discountRate: number;
  type: string;
  product: string[];
  category: string[];
  subCategory: string[];
  createdAt: Date |null;
  updatedAt: Date | null;
}

export interface FilteredCoupon{
  _id: string;
  couponName: string;
}

export interface SingleCouponType{
  _id: string;
  couponName: string;
  startDate: Date;
  expirationDate: Date;
  discountRate: number;
  type: string;
  product: Pick<ProductType, '_id' | 'productName' | 'description'|'carat' | 'weight' | 'unitPrice' | 'category' | 'subCategory' | 'stockQuantity'>[];
  category:  CategoryState;
  subCategory:  SubCategoryState;
  createdAt: Date |null;
  updatedAt: Date | null;
}
export interface CouponState {
  coupons: CouponType[];
  filteredCoupons:FilteredCoupon[];
  isCouponCreated:boolean;
  isCouponUpdated:boolean;
  isCouponDeleted:boolean;
  isCouponApplied:boolean;
  isLoading:boolean;
  singleCoupon:SingleCouponType |null
}

const initialState: CouponState = {
  coupons: [],
  filteredCoupons:[],
  isCouponCreated:false,
  isCouponUpdated:false,
  isCouponDeleted:false,
  isCouponApplied:false,
  isLoading:false,
  singleCoupon:null
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    getAllCoupons: (state, action: PayloadAction<CouponType[]>) => {
      state.coupons = action.payload;
    },
    getFilteredCoupons: (state, action: PayloadAction<FilteredCoupon[]>) => {
        state.filteredCoupons = action.payload;
      },
    setIsCouponCreated:(state, action: PayloadAction<boolean>)=>{
        state.isCouponCreated=action.payload;
    },
    updateCoupon: (state, action: PayloadAction<CouponType>) => {
      state.coupons = state.coupons.map((coupon) =>
        coupon._id === action.payload._id ? action.payload : coupon
      );
    },
    setIsCouponUpdated:(state,action:PayloadAction<boolean>)=>{
      state.isCouponUpdated=action.payload;
    },
    setIsCouponDeleted:(state,action:PayloadAction<boolean>)=>{
      state.isCouponDeleted=action.payload;
    },
    deleteCoupon:(state, action: PayloadAction<string>) => {
        state.coupons = state.coupons.filter((coupon) =>
            coupon._id !== action.payload 
        );
      },
    getSingleCoupon:(state,action:PayloadAction<SingleCouponType>)=>{
      state.singleCoupon=action.payload;
    },
    setIsCouponApplied:(state,action:PayloadAction<boolean>)=>{
      state.isCouponApplied=action.payload;
    },
    setIsLoading:(state,action:PayloadAction<boolean>)=>{
      state.isLoading=action.payload;
    },
  },
});

const couponActions =couponSlice.actions;
const couponReducer = couponSlice.reducer;

export { couponActions, couponReducer };
