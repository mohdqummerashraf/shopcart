import { FormHelperText, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion';

export const ProductCard = ({ product, handleAddRemoveFromWishlist }) => {
    const navigate = useNavigate(); // Always call useNavigate at the top level
    const theme = useTheme(); // Always call useTheme at the top level
    const is408 = useMediaQuery(theme.breakpoints.down(408)); // Always call useMediaQuery at the top level

    const wishlistItems = useSelector(selectWishlistItems);
    const loggedInUser = useSelector(selectLoggedInUser);
    const cartItems = useSelector(selectCartItems);
    const dispatch = useDispatch();

    // Check if product is defined
    if (!product) {
        return <Typography variant="body1" color="error">Product not found</Typography>;
    }

    const { id, title, price, thumbnail, stockQuantity, isWishlistCard, isAdminCard } = product;

    const isProductAlreadyinWishlist = wishlistItems.some((item) => item?.product?._id === id);
    const isProductAlreadyInCart = cartItems.some((item) => item?.product?._id === id);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        const data = { user: loggedInUser?._id, product: id };
        dispatch(addToCartAsync(data));
    };

    // Calculate discount price
    const discountedPrice = (price * (1 - (product?.discountPercentage || 10) / 100)).toFixed(2);

    return (
        <Stack component={isAdminCard ? "" : isWishlistCard ? "" : is408 ? '' : Paper} 
               mt={is408 ? 2 : 0} elevation={1} p={2}
               width={is408 ? 'auto' : '340px'} // Simplified width logic
               sx={{ cursor: "pointer" }}
               onClick={() => navigate(`/product-details/${product?._id}`)}
        >
            {/* Image Display */}
            <Stack>
                <img width={'100%'} style={{ aspectRatio: 1 / 1, objectFit: "contain" }} height={'100%'} 
                     src={thumbnail} alt={`${title} photo unavailable`} />
            </Stack>

            {/* Lower Section */}
            <Stack flex={2} justifyContent={'flex-end'} spacing={1} rowGap={2}>
                <Stack>
                    <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography variant='h6' fontWeight={400}>{title}</Typography>
                        {!isAdminCard && (
                            <motion.div whileHover={{ scale: 1.3, y: -10, zIndex: 100 }} 
                                        whileTap={{ scale: 1 }} 
                                        transition={{ duration: .4, type: "spring" }}>
                                <Checkbox onClick={(e) => e.stopPropagation()} 
                                          checked={isProductAlreadyinWishlist} 
                                          onChange={(e) => handleAddRemoveFromWishlist(e, id)} 
                                          icon={<FavoriteBorder />} 
                                          checkedIcon={<Favorite sx={{ color: 'red' }} />} />
                            </motion.div>
                        )}
                    </Stack>
                    <Typography color={"text.secondary"}>{product?.brand?.name || ''}</Typography>
                </Stack>

                {/* Price and Discount */}
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant='body2' color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                            ₹{price}
                        </Typography>
                        <Typography variant='h6' fontWeight={'bold'}>
                            ₹{discountedPrice}
                        </Typography>
                    </Stack>

                    {/* Add to Cart Button */}
                    {!isWishlistCard && !isProductAlreadyInCart && !isAdminCard && (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 1 }}
                            onClick={(e) => handleAddToCart(e)}
                            style={{
                                padding: "10px 15px",
                                borderRadius: "3px",
                                outline: "none",
                                border: "none",
                                cursor: "pointer",
                                backgroundColor: "black",
                                color: "white",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", columnGap: ".5rem" }}>
                                <p>Add To Cart</p>
                            </div>
                        </motion.button>
                    )}
                </Stack>

                {/* Stock Quantity Warning */}
                {stockQuantity <= 20 && (
                    <FormHelperText sx={{ fontSize: ".9rem" }} error>
                        {stockQuantity === 1 ? "Only 1 stock is left" : "Only a few left"}
                    </FormHelperText>
                )}
            </Stack>
        </Stack>
    );
};
