import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { deleteUserById, fetchAllUser, fetchLoggedInUserById, fetchUserById, updateUserById } from './UserApi'
import { axiosi } from '../../config/axios'

const initialState={
    status:"idle",
    users:[],
    userInfo:null,
    userData:null,
    errors:null,
    successMessage:null,
    updateMessage:'idle',
    deleteMessage: null,

}

export const fetchAllUserAsync=createAsyncThunk('user/fetchAllUserAsync',async()=>{
    const users=await fetchAllUser()
    return users;
})
export const fetchLoggedInUserByIdAsync=createAsyncThunk('user/fetchLoggedInUserByIdAsync',async(id)=>{
    const userInfo=await fetchLoggedInUserById(id)
    return userInfo
})
export const fetchUserByIdAsync=createAsyncThunk('user/fetchUserByIdAsync',async(id)=>{
    const userData=await fetchUserById(id)
    return userData
})

export const deleteUsersAsync = createAsyncThunk(
    "users/deleteUsersAsync",
    async (data) => {
      const users = await deleteUserById(data);
      return users;
    }
  );
 
export const updateUserByIdAsync = createAsyncThunk(
    "user/updateUserByIdAsync",
    async ({ id, data }, { rejectWithValue, signal }) => {
      try {
        const response = await axiosi.put(
          `/users/updateUser/${id}`,
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

const userSlice=createSlice({
    name:"userSlice",
    initialState:initialState,
    reducers:{
        resetUpdateStatus(state) {
            state.updateMessage = "idle"; // Reset the status to idle
          },
          resetDeleteStatus(state) {
            state.deleteMessage = null; // Reset the deleteMessage to null
          },
    },
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
            .addCase(fetchUserByIdAsync.pending,(state)=>{
                state.status='pending'
            })
            .addCase(fetchUserByIdAsync.fulfilled,(state,action)=>{
                state.status='fulfilled'
                state.userData=action.payload
            })
            .addCase(fetchUserByIdAsync.rejected,(state,action)=>{
                state.status='rejected'
                state.errors=action.error
            })

            .addCase(deleteUsersAsync.fulfilled, (state, action) => {
                state.deleteMessage = "fulfilled";
              })
              .addCase(deleteUsersAsync.rejected, (state, action) => {
                state.deleteMessage = "rejected";
              })

            .addCase(updateUserByIdAsync.pending,(state)=>{
                state.updateMessage='pending'
            })
            .addCase(updateUserByIdAsync.fulfilled,(state,action)=>{
                state.updateMessage='fulfilled'
                // state.userInfo=action.payload
            })
            .addCase(updateUserByIdAsync.rejected,(state,action)=>{
                state.updateMessage='rejected'
                state.errors=action.error
            })
    }
})

export const { resetUpdateStatus } = userSlice.actions;
export const { resetDeleteStatus } = userSlice.actions;



// exporting selectors
export const selectUserStatus=(state)=>state.UserSlice.status
export const selectUserList=(state)=>state.UserSlice.users
export const selectUserInfo=(state)=>state.UserSlice.userInfo
export const selectUserData=(state)=>state.UserSlice.userData
export const selectUserErrors=(state)=>state.UserSlice.errors
export const selectUserSuccessMessage=(state)=>state.UserSlice.successMessage
export const selectupdateMessage=(state)=>state.UserSlice.updateMessage
export const deleteMessages = (state) => state.UserSlice.deleteMessage;



export default userSlice.reducer