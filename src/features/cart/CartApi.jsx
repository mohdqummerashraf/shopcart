import {axiosi} from '../../config/axios'

export const addToCart=async(item)=>{
    console.log("adding item........", item)
    try {
        const res=await axiosi.post('/cart',item)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const fetchCartByUserId=async(id)=>{
    try {
        const res=await axiosi.get(`/cart/user/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const updateCartItemById=async(update)=>{
    try {
        const res=await axiosi.patch(`/cart/${update._id}`,update)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const deleteCartItemById = async ({userId, productId}) => {
    await axiosi.delete(`/cart/user/${userId}/product/${productId}`);
    return productId; // Return only the deleted product ID
};
 
  



export const resetCartByUserId=async(userId)=>{
    try {
        const res=await axiosi.delete(`/cart/user/${userId}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
