import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { createBrands, deleteBrandById, editBrandById, fetchAllBrands, getBrandById } from './BrandApi'
import { axiosi } from '../../config/axios'

const initialState={
    fetchstatus:"idle",
    createStatus:"idle",
    updateStatus:'idle',
    brands:[],
    errors:null,
    deleteMessage:null,
    brandInfo: null

}

export const fetchAllBrandsAsync=createAsyncThunk('brands/fetchAllBrandsAsync',async()=>{
    const brands=await fetchAllBrands()
    return brands;
})
export const createBrandsAsync=createAsyncThunk('brands/createBrandsAsync',async(data)=>{
    const brands=await createBrands(data)
    return brands
})
export const deleteBrandAsync=createAsyncThunk('brands/deleteBrandAsync',async(id)=>{
    const brands=await deleteBrandById(id)
    return brands
})
export const getBrandAsync=createAsyncThunk('brands/getBrandAsync',async(id)=>{
    const brands=await getBrandById(id)
    return brands
})
export const editBrandAsync = createAsyncThunk(
    'brands/editBrandById',
    async ({ id, data }, { rejectWithValue, signal }) => {
        try {
            const response = await axiosi.put(`/brands/update-brand/${id}`, data, {
                signal, // Pass the signal for aborting the request
            });
            return response.data; // Return the response data
        } catch (error) {
            // Check if the error is due to the request being aborted
            if (axiosi.isCancel(error)) {
                console.log('Request canceled:', error.message);
                return rejectWithValue('Request canceled');
            }
            // Handle other errors
            return rejectWithValue(error.response.data);
        }
    }
);

const brandSlice=createSlice({
    name:"brandSlice",
    initialState:initialState,
    reducers:{
            resetBrandStatus(state) {
                state.createStatus = 'idle'; // Reset the status to idle
            },
            resetDeleteStatus(state) {
                state.deleteMessage = null // Reset the deleteMessage to null
            },
            resetUpdateStatus(state) {
                state.updateStatus = 'idle' // Reset the deleteMessage to null
            },
    },
    extraReducers:(builder)=>{
        builder
            .addCase(createBrandsAsync.pending,(state)=>{
                state.createStatus='idle'
            })
            .addCase(createBrandsAsync.fulfilled,(state,action)=>{
                
                state.createStatus='fulfilled'
                state.brands=[...state.brands, action.payload]
            })
            .addCase(createBrandsAsync.rejected,(state,action)=>{
                state.createStatus='rejected'
                state.errors=action.error
            })
            .addCase(fetchAllBrandsAsync.pending, (state, action) => {
                state.fetchstatus='idle'
            })
            .addCase(fetchAllBrandsAsync.fulfilled, (state, action) => {
                state.fetchstatus = 'fulfilled';
                state.brands = action.payload; // Store the fetched brands
            })
            .addCase(fetchAllBrandsAsync.rejected, (state, action) => {
                state.fetchstatus = 'rejected';
                state.errors = action.error;
            })
            .addCase(editBrandAsync.pending, (state, action) => {
                state.updateStatus='idle'
            })
            .addCase(editBrandAsync.fulfilled, (state, action) => {
                state.updateStatus = 'fulfilled';
             })
            .addCase(editBrandAsync.rejected, (state, action) => {
                state.updateStatus = 'rejected';
                state.errors = action.error;
            })
            .addCase(deleteBrandAsync.fulfilled, (state, action)=>{
                state.deleteMessage='fulfilled'
            })
            .addCase(deleteBrandAsync.rejected, (state, action)=>{
                state.deleteMessage='rejected'
            })
            .addCase(getBrandAsync.fulfilled, (state, action)=>{
                state.brandInfo=action.payload
            })

    }
})

// exporting selectors
export const { resetBrandStatus } = brandSlice.actions;
export const { resetDeleteStatus } = brandSlice.actions;
export const { resetUpdateStatus } = brandSlice.actions;

export const selectBrandStatus=(state)=>state.BrandSlice.fetchStatus
export const selectCreateBrandStatus=(state)=>state.BrandSlice.createStatus
export const selectBrands=(state)=>state.BrandSlice.brands
export const selectBrandErrors=(state)=>state.BrandSlice.errors
export const deleteMessages=(state)=>state.BrandSlice.deleteMessage
export const brandDetail=(state)=>state.BrandSlice.brandInfo
export const updateStatus=(state)=>state.BrandSlice.updateStatus


export default brandSlice.reducer