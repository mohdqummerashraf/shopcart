import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  fetchCartByUserId,
  updateCartItemById,
  deleteCartItemById,
  resetCartByUserId,
} from "./CartApi";

// Initial state setup
const initialState = {
  status: "idle",
  items: [], // For logged-in users' cart items
  cartItemAddStatus: "idle",
  cartItemRemoveStatus: "idle",
  errors: null,
  successMessage: null,
  cartCount: [], // For guest cart items
};

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (item) => {
    const addedItem = await addToCart(item);
    return addedItem;
  }
);
export const fetchCartByUserIdAsync = createAsyncThunk(
  "cart/fetchCartByUserIdAsync",
  async (id) => {
    const items = await fetchCartByUserId(id);
    return items;
  }
);
export const updateCartItemByIdAsync = createAsyncThunk(
  "cart/updateCartItemByIdAsync",
  async (update) => {
    const updatedItem = await updateCartItemById(update);
    return updatedItem;
  }
);
export const deleteCartItemByIdAsync = createAsyncThunk(
  "cart/deleteCartItemByIdAsync",
  async ({ userId, productId }) => {
    const deletedItem = await deleteCartItemById({ userId, productId });
    return deletedItem;
  }
);
export const resetCartByUserIdAsync = createAsyncThunk(
  "cart/resetCartByUserIdAsync",
  async (userId) => {
    const updatedCart = await resetCartByUserId(userId);
    return updatedCart;
  }
);

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    // Reset status after adding/removing items
    resetCartItemAddStatus: (state) => {
      state.cartItemAddStatus = "idle";
    },
    resetCartItemRemoveStatus: (state) => {
      state.cartItemRemoveStatus = "idle";
    },

    // Add product to cart (for guest cart)
    addProductToCart: (state, action) => {
      const product = action.payload;

      if (!product || !product._id) {
        console.error("Invalid product data:", product);
        return;
      }

      const existingProduct = state.cartCount.find(
        (item) => item._id === product._id
      );
      console.log("existingProduct", existingProduct);

      if (existingProduct) {
        // If product exists, increment the quantity
        existingProduct.quantity += 1;
      } else {
        // Otherwise, add new product to cartCount
        state.cartCount.push({ ...product, quantity: 1 });
      }
    },

    decreaseProductQuantity: (state, action) => {
      const productId = action.payload;
    
      const existingProduct = state.cartCount.find(
        (item) => item._id === productId
      );
      console.log("existingProduct", existingProduct);
    
      if (existingProduct) {
        // If the product exists and quantity is greater than 1, decrease the quantity
        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1;
        } else {
          // If quantity is 1, remove the product from cart
          state.cartCount = state.cartCount.filter((item) => item._id !== productId);
        }
      }
    },

    removeProductFromCart: (state, action) => {
      const productId = action.payload;
      state.cartCount = state.cartCount.filter((item) => {
        return item._id !== productId;
      });
    },

    // Merge guest cart with logged-in user's cart
    mergeGuestCartWithUserCart: (state) => {
      const guestCart = state.cartCount;

      guestCart.forEach((guestItem) => {
        const existingItem = state.items.find(
          (item) => item._id === guestItem._id
        );
        if (existingItem) {
          existingItem.quantity += guestItem.quantity; // Merge quantities
        } else {
          state.items.push(guestItem); // Add new items
        }
      });

      // Clear guest cart after merging
      state.cartCount = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.cartItemAddStatus = "pending";
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.cartItemAddStatus = "fulfilled";
        state.items.push(action.payload || {}); // Fallback to empty object if no payload
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.cartItemAddStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(fetchCartByUserIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchCartByUserIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.items = action.payload || []; // Fallback to empty array if no payload
      })
      .addCase(fetchCartByUserIdAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      })

      .addCase(updateCartItemByIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateCartItemByIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCartItemByIdAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      })

      .addCase(deleteCartItemByIdAsync.pending, (state) => {
        state.cartItemRemoveStatus = "pending";
      })
      .addCase(deleteCartItemByIdAsync.fulfilled, (state, action) => {
        state.cartItemRemoveStatus = "fulfilled";
        state.items = state.items.filter((item) => {
          console.log("item.product._id", item.product._id);
          console.log("action.payload", action.payload);
          return item.product._id !== action.payload;
        });
      })

      .addCase(deleteCartItemByIdAsync.rejected, (state, action) => {
        state.cartItemRemoveStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(resetCartByUserIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(resetCartByUserIdAsync.fulfilled, (state) => {
        state.status = "fulfilled";
        state.items = [];
      })
      .addCase(resetCartByUserIdAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      });
  },
});

// Exporting selectors
export const selectCartStatus = (state) => state.cartSlice.status;
export const selectCartItems = (state) => state.cartSlice.items;
export const selectCartErrors = (state) => state.cartSlice.errors;
export const selectCartSuccessMessage = (state) =>
  state.cartSlice.successMessage;
export const selectCartItemAddStatus = (state) =>
  state.cartSlice.cartItemAddStatus;
export const selectCartItemRemoveStatus = (state) =>
  state.cartSlice.cartItemRemoveStatus;
export const selectCartCount = (state) => state.cartSlice.cartCount;

// Exporting reducers
export const {
  resetCartItemAddStatus,
  resetCartItemRemoveStatus,
  addProductToCart,
  removeProductFromCart,
  mergeGuestCartWithUserCart,
  decreaseProductQuantity
} = cartSlice.actions;

export default cartSlice.reducer;
