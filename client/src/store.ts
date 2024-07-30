import {  Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { themeReducers, ThemeState } from './slices/themeSlice';
import { authReducers, UserLoggedInState } from './slices/authSlice';
import { productReducers, ProductState } from './slices/productSlice';
import { categoryReducer, CategoryState } from './slices/categorySlice';
import { subCategoryReducer, SubCategoryState } from './slices/subCategorySlice';
import { userReducer, UserState } from './slices/userSlice';

export type RootState = {
    theme: ThemeState;
    auth: {
        user: UserLoggedInState | null;
    };
    product: ProductState; 
    category: {
        categories: CategoryState[];
        CategoryNumber: number;
    };
    subCategory: {
        subCategories: SubCategoryState[];
        subCategoryNumber: number;
    };
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
   });

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