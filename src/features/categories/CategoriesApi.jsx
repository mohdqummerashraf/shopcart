import { axiosi } from "../../config/axios"

export const fetchAllCategories=async()=>{
    try {
        const res=await axiosi.get("/categories")
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const createCategories=async(data)=>{
    try {
        const res=await axiosi.post("/categories/create-category", data)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const deleteCategoryById=async(id)=>{
    try {
        const res=await axiosi.delete(`/categories/delete-category/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const editCategoryById = async (id, data) => {
    try {
        console.log("Sending data to update:", data); // Log the data being sent
        const res = await axiosi.put(`/categories/update-category/${id}`, data); // Pass the id and data
        console.log("Response from server:", res.data); // Log the response for debugging
        return res.data; // Return the updated Category data
    } catch (error) {
        // Log the entire error response for debugging
        console.error("Error response from server:", error.response);
        throw error.response?.data || { message: "Error updating Category" }; // Handle error properly
    }
};  

export const getCategoryById=async(id)=>{
    try {
        const res=await axiosi.get(`/categories/categoryById/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}