import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import persistConfig from "./persistConfig"; // Import your persistConfig

import AuthSlice from "../features/auth/AuthSlice";
import ProductSlice from "../features/products/ProductSlice";
import UserSlice from "../features/user/UserSlice";
import BrandSlice from "../features/brands/BrandSlice";
import CategoriesSlice from "../features/categories/CategoriesSlice";
import AddressSlice from "../features/address/AddressSlice";
import ReviewSlice from "../features/review/ReviewSlice";
import OrderSlice from "../features/order/OrderSlice";
import WishlistSlice from "../features/wishlist/WishlistSlice";
import cartSlice from "../features/cart/CartSlice";
import { combineReducers } from "redux";

// Create the root reducer
const rootReducer = combineReducers({
  AuthSlice,
  ProductSlice,
  UserSlice,
  BrandSlice,
  CategoriesSlice,
  cartSlice,
  AddressSlice,
  ReviewSlice,
  OrderSlice,
  WishlistSlice,
});

// Apply the persistReducer to the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
});

export const persistor = persistStore(store); // Initialize the persistor
