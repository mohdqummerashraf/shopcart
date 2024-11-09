// utils/cartUtils.js
export const getLocalCart = () => JSON.parse(localStorage.getItem('guestCart')) || [];

export const setLocalCart = (cartItems) => {
  localStorage.setItem('guestCart', JSON.stringify(cartItems));
};

export const clearLocalCart = () => {
  localStorage.removeItem('guestCart');
};
