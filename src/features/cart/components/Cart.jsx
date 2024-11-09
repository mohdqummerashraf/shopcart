import React, { useEffect } from "react";
import { CartItem } from "./CartItem";
import {
  Button,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { resetCartItemRemoveStatus } from "../CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SHIPPING, TAXES } from "../../../constants";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { selectLoggedInUser } from "../../auth/AuthSlice";

export const Cart = ({ checkout }) => {
  const items = useSelector((state) => state.cartSlice?.items);
  const localCart = useSelector((state) => state.cartSlice?.cartCount);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItemRemoveStatus = useSelector((state)=>state.cartSlice?.cartItemRemoveStatus);

 
  const cartItems = loggedInUser ? (items || []) : (localCart || []);


  const subtotal = cartItems.reduce(
    (acc, item) =>
      (
        (item?.product?.price || item?.price) *
        (1 - (item?.product?.discountPercentage || item?.discountPercentage || 10) / 100)
      ).toFixed(2) *
        item.quantity +
      acc,
    0
  );
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));

   const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems]);

  useEffect(() => {
    if (cartItemRemoveStatus === "fulfilled") {
      toast.success("Product removed from cart");
    } else if (cartItemRemoveStatus === "rejected") {
      toast.error("Error removing product from cart, please try again later");
    }
  }, [cartItemRemoveStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetCartItemRemoveStatus());
    };
  }, [dispatch]);

  return (
    <Stack justifyContent={"flex-start"} alignItems={"center"} mb={"5rem"}>
      <Stack
        width={is900 ? "auto" : "50rem"}
        mt={"3rem"}
        paddingLeft={checkout ? 0 : 2}
        paddingRight={checkout ? 0 : 2}
        rowGap={4}
      >
        {/* cart items */}
        <Stack rowGap={2}>
          {cartItems.length > 0 &&
            cartItems.map((item) => (
              <CartItem
                key={item?._id}
                id={item?._id}
                title={item?.product?.title || item?.title}
                brand={item?.product?.brand?.name || item?.brand?.name}
                category={item?.product?.category?.name || item?.category?.name}
                price={item?.product?.price || item?.price}
                quantity={item?.quantity}
                thumbnail={item?.product?.thumbnail || item?.thumbnail}
                stockQuantity={item?.product?.stockQuantity || item?.stockQuantity}
                productId={item?.product?._id || item?._id}
                product={item}
              />
            ))}
        </Stack>

        {/* subtotal */}
        <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
          {checkout ? (
            <Stack rowGap={2} width={"100%"}>
              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>Subtotal</Typography>
                <Typography>₹{subtotal}</Typography>
              </Stack>

              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>Shipping</Typography>
                <Typography>₹{SHIPPING}</Typography>
              </Stack>

              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>Taxes</Typography>
                <Typography>₹{TAXES}</Typography>
              </Stack>

              <hr />

              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>Total</Typography>
                <Typography>₹{Math.round(subtotal + SHIPPING + TAXES)}</Typography>
              </Stack>
            </Stack>
          ) : (
            <>
              <Stack>
                <Typography variant="h6" fontWeight={500}>
                  Subtotal
                </Typography>
                <Typography>Total items in cart {totalItems}</Typography>
                <Typography variant="body1" color={"text.secondary"}>
                  Shipping and taxes will be calculated at checkout.
                </Typography>
              </Stack>

              <Stack>
                <Typography variant="h6" fontWeight={500}>
                  ₹{subtotal}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>

        {/* checkout or continue shopping */}
        {!checkout && (
          <Stack rowGap={"1rem"}>
            {loggedInUser !== null && Object.keys(loggedInUser).length > 1 ? (
              <Button variant="contained" component={Link} to="/checkout">
                Checkout
              </Button>
            ) : (
              <Button variant="contained" component={Link} to={`/login?checkoutLogin=${true}`}>
                Login To Checkout
              </Button>
            )}
            <motion.div style={{ alignSelf: "center" }} whileHover={{ y: 2 }}>
              <Chip
                sx={{ cursor: "pointer", borderRadius: "8px" }}
                component={Link}
                to={"/"}
                label="or continue shopping"
                variant="outlined"
              />
            </motion.div>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
