import {  Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { themeReducers, ThemeState } from './slices/themeSlice';
import { authReducers, AuthState } from './slices/authSlice';
import { productReducers, ProductState } from './slices/productSlice';
import { categoryReducer, CategorySliceState } from './slices/categorySlice';
import { subCategoryReducer, SubCategorySliceState,  } from './slices/subCategorySlice';
import { userReducer, UserState } from './slices/userSlice';

export type RootState = {
    theme: ThemeState;
    auth: AuthState;
    product: ProductState; 
    category: CategorySliceState;
    subCategory: SubCategorySliceState;
    user: UserState
};

const store = configureStore({
    reducer: {
        theme: themeReducers,
        auth: authReducers,
        product: productReducers,
        category: categoryReducer,
        subCategory: subCategoryReducer,
        user:userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: undefined as unknown // Ensure extraArgument is compatible
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

/*
 middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable checks if needed
        }),
*/