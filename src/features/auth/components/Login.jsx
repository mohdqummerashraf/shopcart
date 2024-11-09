import {
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { ecommerceOutlookAnimation } from "../../../assets";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
  selectLoggedInUser,
  loginAsync,
  selectLoginStatus,
  selectLoginError,
  clearLoginError,
  resetLoginStatus,
} from "../AuthSlice";
import { toast } from "react-toastify";
import { MotionConfig, motion } from "framer-motion";
import {
  addToCartAsync,
  fetchCartByUserIdAsync,
  removeProductFromCart,
} from "../../cart/CartSlice";

export const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const loggedInUser = useSelector(selectLoggedInUser);

  const cartCount = useSelector((state) => state.cartSlice?.cartCount);
  const items = useSelector((state) => state.cartSlice?.items);

  const cartItems =
    loggedInUser !== null && Object.keys(loggedInUser).length > 1
      ? items || []
      : cartCount || [];

  // Extract the query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const checkoutLogin = queryParams.get("checkoutLogin");
  const status = useSelector(selectLoginStatus);
  const error = useSelector(selectLoginError);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const [localCartItems, setLocalCartItems] = useState(cartItems); // Backup local cart items
  const [cartSynced, setCartSynced] = useState(false); // Track when cart sync is done

  console.log("localCartItems", localCartItems);

  useEffect(() => {
    const addItemsToServerCart = async () => {
      for (const item of localCartItems) {
        await dispatch(
          addToCartAsync({
            user: loggedInUser._id,
            product: item._id,
            quantity: item.quantity,
          })
        );
        await dispatch(removeProductFromCart(item._id));
      }
      // Fetch updated cart and set sync flag to true after completion
      dispatch(fetchCartByUserIdAsync(loggedInUser._id));
      setCartSynced(true); // Mark sync completion for navigation
    };

    if (loggedInUser && loggedInUser.isVerified && localCartItems.length > 0) {
      addItemsToServerCart();
    }
  }, [loggedInUser, localCartItems, dispatch]);

  console.log("cartSynced", cartSynced);

  useEffect(() => {
    if (loggedInUser && loggedInUser.isVerified) {
      if (cartSynced) {
        const checkoutLogin = new URLSearchParams(location.search).get(
          "checkoutLogin"
        );
        navigate(checkoutLogin ? "/cart" : "/");
      } else {
        navigate("/");
      }
    }
  }, [cartSynced, navigate, location, loggedInUser]);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (status === "fulfilled" && loggedInUser?.isVerified === true) {
      toast.success(`Login successful`);
      reset();
    }
    return () => {
      dispatch(clearLoginError());
      dispatch(resetLoginStatus());
    };
  }, [status, loggedInUser, dispatch, reset]);

  const handleLogin = (data) => {
    const cred = { ...data };
    dispatch(loginAsync(cred)); // Dispatch login action
  };

  return (
    <Stack
      width="90vw"
      height="100vh"
      flexDirection="row"
      sx={{ overflow: "hidden" }}
    >
      {!is900 && (
        <Stack bgcolor="black" flex={1} justifyContent="center">
          <Lottie animationData={ecommerceOutlookAnimation} />
        </Stack>
      )}

      <Stack flex={1} justifyContent="center" alignItems="center">
        <Stack flexDirection="row" justifyContent="center" alignItems="center">
          <Stack rowGap=".4rem">
            <Typography
              variant="h2"
              sx={{ wordBreak: "break-word" }}
              fontWeight={600}
            >
              KingStar
            </Typography>
            <Typography alignSelf="flex-end" color="GrayText" variant="body2">
              - Shop Any Bag
            </Typography>
          </Stack>
        </Stack>

        <Stack
          mt={4}
          spacing={2}
          width={is480 ? "90vw" : "28rem"}
          maxWidth="90vw"
          component="form"
          noValidate
          onSubmit={handleSubmit(handleLogin)}
        >
          <motion.div whileHover={{ y: -5 }}>
            <TextField
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                  message: "Enter a valid email",
                },
              })}
              placeholder="Email"
            />
            {errors.email && (
              <FormHelperText sx={{ mt: 1 }} error>
                {errors.email.message}
              </FormHelperText>
            )}
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <TextField
              type={showPassword ? "text" : "password"}
              fullWidth
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.password && (
              <FormHelperText sx={{ mt: 1 }} error>
                {errors.password.message}
              </FormHelperText>
            )}
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
            <LoadingButton
              fullWidth
              sx={{ height: "2.5rem" }}
              loading={status === "pending"}
              type="submit"
              variant="contained"
            >
              Login
            </LoadingButton>
          </motion.div>

          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap-reverse"
          >
            <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.05 }}>
              <motion.div>
                <Typography
                  mr="1.5rem"
                  sx={{ textDecoration: "none", color: "text.primary" }}
                  to="/forgot-password"
                  component={Link}
                >
                  Forgot password
                </Typography>
              </motion.div>

              <motion.div>
                <Typography
                  sx={{ textDecoration: "none", color: "text.primary" }}
                  to="/signup"
                  component={Link}
                >
                  Don't have an account?{" "}
                  <span style={{ color: theme.palette.primary.dark }}>
                    Register
                  </span>
                </Typography>
              </motion.div>
            </MotionConfig>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
