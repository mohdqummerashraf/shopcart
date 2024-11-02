import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCategories,
  deleteCategoryById,
  fetchAllCategories,
  getCategoryById,
} from "./CategoriesApi";
import { axiosi } from "../../config/axios";

const initialState = {
  fetchstatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  categories: [],
  errors: null,
  deleteMessage: null,
  categoryInfo: null,
};

export const fetchAllCategoriesAsync = createAsyncThunk(
  "categories/fetchAllCategoriesAsync",
  async () => {
    const categories = await fetchAllCategories();
    return categories;
  }
);
export const createCategoriesAsync = createAsyncThunk(
  "categories/createCategoriesAsync",
  async (data) => {
    const categories = await createCategories(data);
    return categories;
  }
);
export const deleteCategoriesAsync = createAsyncThunk(
  "categories/deleteCategoriesAsync",
  async (data) => {
    const categories = await deleteCategoryById(data);
    return categories;
  }
);

export const getCategoryAsync = createAsyncThunk(
  "categories/getCategoryAsync",
  async (id) => {
    const categories = await getCategoryById(id);
    return categories;
  }
);
export const editCategoryAsync = createAsyncThunk(
  "categories/editCategoryAsync",
  async ({ id, data }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosi.put(
        `/categories/update-category/${id}`,
        data,
        {
          signal, // Pass the signal for aborting the request
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      // Check if the error is due to the request being aborted
      if (axiosi.isCancel(error)) {
        console.log("Request canceled:", error.message);
        return rejectWithValue("Request canceled");
      }
      // Handle other errors
      return rejectWithValue(error.response.data);
    }
  }
);

const categorySlice = createSlice({
  name: "categorySlice",
  initialState: initialState,
  reducers: {
    resetCreateStatus(state) {
      state.createStatus = "idle"; // Reset the status to idle
    },
    resetDeleteStatus(state) {
      state.deleteMessage = null; // Reset the deleteMessage to null
    },
    resetUpdateStatus(state) {
      state.updateStatus = "idle"; // Reset the deleteMessage to null
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createCategoriesAsync.pending, (state) => {
        state.createStatus = "idle";
      })
      .addCase(createCategoriesAsync.fulfilled, (state, action) => {
        state.createStatus = "fulfilled";
        state.categories = [...state.categories, action.payload];
      })
      .addCase(createCategoriesAsync.rejected, (state, action) => {
        state.createStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(fetchAllCategoriesAsync.pending, (state) => {
        state.status = "idle";
      })
      .addCase(fetchAllCategoriesAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.categories = action.payload;
      })
      .addCase(fetchAllCategoriesAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      })
      .addCase(deleteCategoriesAsync.fulfilled, (state, action) => {
        state.deleteMessage = "fulfilled";
      })
      .addCase(deleteCategoriesAsync.rejected, (state, action) => {
        state.deleteMessage = "rejected";
      })
      .addCase(editCategoryAsync.pending, (state, action) => {
        state.updateStatus = "idle";
      })
      .addCase(editCategoryAsync.fulfilled, (state, action) => {
        state.updateStatus = "fulfilled";
      })
      .addCase(editCategoryAsync.rejected, (state, action) => {
        state.updateStatus = "rejected";
        state.errors = action.error;
      })
      .addCase(getCategoryAsync.fulfilled, (state, action) => {
        state.categoryInfo = action.payload;
      });
  },
});

export const { resetDeleteStatus } = categorySlice.actions;
export const { resetCreateStatus } = categorySlice.actions;
export const { resetUpdateStatus } = categorySlice.actions;

// exporting selectors
export const selectCategoryStatus = (state) => state.CategoriesSlice.createStatus;
export const selectCategories = (state) => state.CategoriesSlice.categories;
export const selectCategoryErrors = (state) => state.CategoriesSlice.errors;
export const deleteMessages = (state) => state.CategoriesSlice.deleteMessage;
export const updateStatus = (state) => state.CategoriesSlice.updateStatus;
export const categoryDetail = (state) => state.CategoriesSlice.categoryInfo;

export default categorySlice.reducer;
