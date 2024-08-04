import {  Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { themeReducers, ThemeState } from './slices/themeSlice';
import { authReducers, AuthState } from './slices/authSlice';
import { productReducers, ProductState } from './slices/productSlice';
import { categoryReducer, CategorySliceState } from './slices/categorySlice';
import { subCategoryReducer, SubCategorySliceState,  } from './slices/subCategorySlice';
import { userReducer, UserState } from './slices/userSlice';
import { storeReducer, StoreState } from './slices/storeSlice';
import { clientReducer, ClientState } from './slices/clientSlice';
import { orderReducer, OrderState } from './slices/orderSlice';

export type RootState = {
    theme: ThemeState;
    auth: AuthState;
    product: ProductState; 
    category: CategorySliceState;
    subCategory: SubCategorySliceState;
    user: UserState,
    store:StoreState,
    client:ClientState,
    order:OrderState
};

const store = configureStore({
    reducer: {
        theme: themeReducers,
        auth: authReducers,
        product: productReducers,
        category: categoryReducer,
        subCategory: subCategoryReducer,
        user:userReducer,
        store:storeReducer,
        client:clientReducer,
        order:orderReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: undefined as unknown 
            },
            serializableCheck: false,
        }),
   });
   export type RootStateTest = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;

