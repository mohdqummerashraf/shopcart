import {
  FormHelperText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  addProductToCart,
  removeProductFromCart,
  addToCartAsync,
  removeFromCartAsync,
  selectCartItems,
  deleteCartItemByIdAsync,
} from "../../cart/CartSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export const ProductCard = ({ product, handleAddRemoveFromWishlist }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const is408 = useMediaQuery(theme.breakpoints.down(408));

  const wishlistItems = useSelector(selectWishlistItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartCount = useSelector((state) => state.cartSlice?.cartCount);
  const items = useSelector((state) => state.cartSlice?.items);

  const dispatch = useDispatch();

  const cartItems =
    loggedInUser !== null && Object.keys(loggedInUser).length > 1
      ? items || []
      : cartCount || [];

  if (!product) {
    return (
      <Typography variant="body1" color="error">
        Product not found
      </Typography>
    );
  }

  const {
    id,
    title,
    price,
    thumbnail,
    stockQuantity,
    isWishlistCard,
    isAdminCard,
  } = product;

  const isProductAlreadyinWishlist = wishlistItems?.some((item) => {
     
    if (loggedInUser !== null) {
      return item?.product?._id === product?._id;
    }
    {
      return item?.product?._id === product?._id
    }
  });

  const isProductAlreadyInCart = (cartItems || [])?.some((item) => {
    if (loggedInUser !== null) {
      return item?.product?._id === product?._id;
    }
    {
      return item?._id === product?._id;
    }
  });


  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const productId = product?._id;
    if (loggedInUser !== null && Object.keys(loggedInUser).length > 1) {
      const data = { user: loggedInUser?._id, product: productId, quantity: 1 };
      dispatch(addToCartAsync(data));
    } else {
      dispatch(addProductToCart(product));
    }
    toast.success(`Product added to cart!`);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    const productId = product?._id;
    const userId = loggedInUser?._id;
  
    if (loggedInUser !== null && Object.keys(loggedInUser).length > 1) {
      dispatch(deleteCartItemByIdAsync({ userId, productId }));
      toast.success("Product removed from cart!");
    } else {
      dispatch(removeProductFromCart(productId));
      toast.success("Product removed from cart!");
    }
  };
  

  const discountedPrice = (
    price *
    (1 - (product?.discountPercentage || 10) / 100)
  ).toFixed(2);

  return (
    <Stack
      component={isAdminCard ? "" : isWishlistCard ? "" : is408 ? "" : Paper}
      mt={is408 ? 2 : 0}
      elevation={1}
      p={2}
      width={is408 ? "auto" : "340px"}
      sx={{ cursor: "pointer" }}
      onClick={() => navigate(`/product-details/${product?._id}`)}
    >
      <Stack>
        <img
          width={"100%"}
          style={{ aspectRatio: 1 / 1, objectFit: "contain" }}
          height={"100%"}
          src={thumbnail}
          alt={`${title} photo unavailable`}
        />
      </Stack>

      <Stack flex={2} justifyContent={"flex-end"} spacing={1} rowGap={2}>
        <Stack>
          <Stack
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h6" fontWeight={400}>
              {title}
            </Typography>
            {!isAdminCard && (
              <motion.div
                whileHover={{ scale: 1.3, y: -10, zIndex: 100 }}
                whileTap={{ scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={isProductAlreadyinWishlist}
                  onChange={(e) => handleAddRemoveFromWishlist(e, product?._id)}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite sx={{ color: "red" }} />}
                />
              </motion.div>
            )}
          </Stack>
          <Typography color={"text.secondary"}>
            {product?.brand?.name || ""}
          </Typography>
        </Stack>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textDecoration: "line-through" }}
            >
              ₹{price}
            </Typography>
            <Typography variant="h6" fontWeight={"bold"}>
              ₹{discountedPrice}
            </Typography>
          </Stack>

          {!isWishlistCard && !isAdminCard && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 1 }}
              onClick={(e) =>
                isProductAlreadyInCart
                  ? handleRemoveFromCart(e)
                  : handleAddToCart(e)
              }
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: ".5rem",
                }}
              >
                <p>
                  {isProductAlreadyInCart ? "Remove from Cart" : "Add To Cart"}
                </p>
              </div>
            </motion.button>
          )}
        </Stack>

        {stockQuantity <= 20 && (
          <FormHelperText sx={{ fontSize: ".9rem" }} error>
            {stockQuantity === 1 ? "Only 1 stock is left" : "Only a few left"}
          </FormHelperText>
        )}
      </Stack>
    </Stack>
  );
};
