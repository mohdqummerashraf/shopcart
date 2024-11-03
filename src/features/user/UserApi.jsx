import { axiosi } from "../../config/axios"

 
 
export const fetchAllUser=async()=>{
    try {
        const res=await axiosi.get(`/users/all`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const fetchLoggedInUserById=async(id)=>{
    try {
        const res=await axiosi.get(`/users/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const fetchUserById=async(id)=>{
    try {
        const res=await axiosi.get(`/users/userById/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const updateUserById=async(id,data)=>{
    console.log("data", data)
    try {
        const res=await axiosi.patch(`/users/${id.id}`,id.data)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const deleteUserById=async(id)=>{
    try {
        const res=await axiosi.delete(`/users/deleteById/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}