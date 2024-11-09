import {
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  decreaseProductQuantity,
  deleteCartItemByIdAsync,
  removeProductFromCart,
  setCartFromLocalStorage,
  updateCartItemByIdAsync,
} from "../CartSlice";
import { Link } from "react-router-dom";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { getLocalCart, setLocalCart } from "../../../app/cardutils";

export const CartItem = ({
  id,
  thumbnail,
  title,
  category,
  brand,
  price,
  quantity,
  stockQuantity,
  discountPercentage,
  productId,
  product
}) => {

  console.log("title", title)
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const is552 = useMediaQuery(theme.breakpoints.down(552));

  const handleAddQty = () => {
    if (loggedInUser && Object.keys(loggedInUser).length > 1) {
      // For logged-in users, update quantity on the server
      const update = { _id: id, quantity: quantity + 1 };
      dispatch(updateCartItemByIdAsync(update));
    } else {
       dispatch(addProductToCart(product)); // Dispatch update action to Redux for both logged-in and guest users
    }
  };
  

  const handleRemoveQty = () => {
    if (quantity === 1) {
      if (loggedInUser && Object.keys(loggedInUser).length > 1) {
        dispatch(deleteCartItemByIdAsync(id)); // Remove from the server (logged-in)
      } else {
        // Remove from Redux store directly (guest users)
        dispatch(removeProductFromCart(productId));
      }
    } else {
      if (loggedInUser && Object.keys(loggedInUser).length > 1) {
        const update = { _id: id, quantity: quantity - 1 };
        dispatch(updateCartItemByIdAsync(update)); // Update quantity on the server (logged-in)
      } else {
        // For guest users, update quantity directly in Redux store
        dispatch(decreaseProductQuantity(productId));

      }
    }
  };
  

  const handleProductRemove = () => {
     const userId = loggedInUser?._id;
    if (loggedInUser && Object.keys(loggedInUser).length > 1) {
      // For logged-in users, remove item from the server
      dispatch(deleteCartItemByIdAsync({ userId, productId }));
    } else {
      // For guest users, remove item directly from Redux
      dispatch(removeProductFromCart(productId));
    }
  };
  

  return (
    <Stack
      bgcolor={"white"}
      component={is900 ? "" : Paper}
      p={is900 ? 0 : 2}
      elevation={1}
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      {/* image and details */}
      <Stack
        flexDirection={"row"}
        rowGap={"1rem"}
        alignItems={"center"}
        columnGap={2}
        flexWrap={"wrap"}
      >
        <Stack
          width={is552 ? "auto" : "200px"}
          height={is552 ? "auto" : "200px"}
          component={Link}
          to={`/product-details/${productId}`}
        >
          <img
            style={{
              width: "100%",
              height: is552 ? "auto" : "100%",
              aspectRatio: is552 ? 1 / 1 : "",
              objectFit: "contain",
            }}
            src={thumbnail}
            alt={`${title} image unavailabe`}
          />
        </Stack>

        <Stack alignSelf={""}>
          <Typography
            component={Link}
            to={`/product-details/${productId}`}
            sx={{ textDecoration: "none", color: theme.palette.primary.main }}
            variant="h6"
            fontWeight={500}
          >
            {title}
          </Typography>
          <Typography variant="body2" color={"text.secondary"}>
            {brand}
          </Typography>
          <Typography mt={1}>Quantity</Typography>
          <Stack flexDirection={"row"} alignItems={"center"}>
            <IconButton onClick={handleRemoveQty}>
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography>{quantity}</Typography>
            <IconButton onClick={handleAddQty}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      {/* price and remove button */}
      <Stack
        justifyContent={"space-evenly"}
        alignSelf={is552 ? "flex-end" : ""}
        height={"100%"}
        rowGap={"1rem"}
        alignItems={"flex-end"}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ textDecoration: "line-through" }}
          >
            ₹{price}
          </Typography>
          <Typography variant="h4" fontWeight={"bold"}>
            ₹{(price * (1 - (discountPercentage || 10) / 100)).toFixed(2)}
          </Typography>
        </Stack>
        <Button
          size={is480 ? "small" : ""}
          onClick={handleProductRemove}
          variant="contained"
        >
          Remove
        </Button>
      </Stack>
    </Stack>
  );
};
