import { axiosi } from "../../config/axios";

export const fetchAllBrands=async()=>{
    try {
        const res=await axiosi.get("/brands")
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const createBrands=async(data)=>{
    try {
        const res=await axiosi.post("/brands/create-brand", data)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
 

export const editBrandById = async (id, data) => {
    try {
        console.log("Sending data to update:", data); // Log the data being sent
        const res = await axiosi.put(`/brands/update-brand/${id}`, data); // Pass the id and data
        console.log("Response from server:", res.data); // Log the response for debugging
        return res.data; // Return the updated brand data
    } catch (error) {
        // Log the entire error response for debugging
        console.error("Error response from server:", error.response);
        throw error.response?.data || { message: "Error updating brand" }; // Handle error properly
    }
};  

export const getBrandById=async(id)=>{
    try {
        const res=await axiosi.get(`/brands/brandById/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const deleteBrandById=async(id)=>{
    try {
        const res=await axiosi.delete(`/brands/delete-brand/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}