import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { fetchAllUser, fetchLoggedInUserById, updateUserById } from './UserApi'

const initialState={
    status:"idle",
    users:[],
    userInfo:null,
    errors:null,
    successMessage:null
}

export const fetchAllUserAsync=createAsyncThunk('user/fetchAllUserAsync',async()=>{
    const users=await fetchAllUser()
    return users;
})
export const fetchLoggedInUserByIdAsync=createAsyncThunk('user/fetchLoggedInUserByIdAsync',async(id)=>{
    const userInfo=await fetchLoggedInUserById(id)
    return userInfo
})
export const updateUserByIdAsync=createAsyncThunk('user/updateUserByIdAsync',async(update)=>{
    const updatedUser=await updateUserById(update)
    return updatedUser
})

const userSlice=createSlice({
    name:"userSlice",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchAllUserAsync.fulfilled,(state, action)=>{
                console.log("action.payload", action.payload)
                state.users=action.payload
            })
            .addCase(fetchLoggedInUserByIdAsync.pending,(state)=>{
                state.status='pending'
            })
            .addCase(fetchLoggedInUserByIdAsync.fulfilled,(state,action)=>{
                state.status='fulfilled'
                state.userInfo=action.payload
            })
            .addCase(fetchLoggedInUserByIdAsync.rejected,(state,action)=>{
                state.status='rejected'
                state.errors=action.error
            })

            .addCase(updateUserByIdAsync.pending,(state)=>{
                state.status='pending'
            })
            .addCase(updateUserByIdAsync.fulfilled,(state,action)=>{
                state.status='fulfilled'
                state.userInfo=action.payload
            })
            .addCase(updateUserByIdAsync.rejected,(state,action)=>{
                state.status='rejected'
                state.errors=action.error
            })
    }
})

// exporting selectors
export const selectUserStatus=(state)=>state.UserSlice.status
export const selectUserList=(state)=>state.UserSlice.users
export const selectUserInfo=(state)=>state.UserSlice.userInfo
export const selectUserErrors=(state)=>state.UserSlice.errors
export const selectUserSuccessMessage=(state)=>state.UserSlice.successMessage


export default userSlice.reducer