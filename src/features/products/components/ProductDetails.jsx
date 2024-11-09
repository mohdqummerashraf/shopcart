import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectSelectedProduct,
} from "../ProductSlice";
import {
  Box,
  Checkbox,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  Button,
  Paper,
  MobileStepper,
} from "@mui/material";
import {
  addProductToCart,
  addToCartAsync,
  decreaseProductQuantity,
  deleteCartItemByIdAsync,
  removeProductFromCart,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems,
  updateCartItemByIdAsync,
} from "../../cart/CartSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  fetchReviewsByProductIdAsync,
  resetReviewFetchStatus,
  selectReviewFetchStatus,
  selectReviews,
} from "../../review/ReviewSlice";
import { Reviews } from "../../review/components/Reviews";
import { toast } from "react-toastify";
import { MotionConfig, motion } from "framer-motion";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import Favorite from "@mui/icons-material/Favorite";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice";
import { useTheme } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
// import SwipeableViews from 'react-swipeable-views';
// import { autoPlay } from 'react-swipeable-views-utils';
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";
import Slider from "react-slick";
import { getLocalCart, setLocalCart } from "../../../app/cardutils";

const SIZES = ["XS", "S", "M", "L"];
const COLORS = ["#020202", "#F6F6F6", "#B82222"];
// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

export const ProductDetails = () => {
  const { id } = useParams();
  const product = useSelector(selectSelectedProduct);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cartSlice?.cartCount);
  const items = useSelector((state) => state.cartSlice?.items);
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
  const reviews = useSelector(selectReviews);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const theme = useTheme();
  const is1420 = useMediaQuery(theme.breakpoints.down(1420));
  const is990 = useMediaQuery(theme.breakpoints.down(990));
  const is840 = useMediaQuery(theme.breakpoints.down(840));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const wishlistItems = useSelector(selectWishlistItems);

  const cartItems =
    loggedInUser !== null && Object.keys(loggedInUser).length > 1
      ? items || []
      : cartCount || [];

  const isProductAlreadyinWishlist = wishlistItems?.some((item) => {
    if (loggedInUser !== null) {
      return item?.product?._id === product?._id;
    }
    {
      return item?.product?._id === product?._id;
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

  const productFetchStatus = useSelector(selectProductFetchStatus);
  const reviewFetchStatus = useSelector(selectReviewFetchStatus);

  const totalReviewRating = reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  const totalReviews = reviews.length;
  const averageRating = parseInt(Math.ceil(totalReviewRating / totalReviews));

  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const discountedPrice = (
    product?.price *
    (1 - (product?.discountPercentage || 10) / 100)
  ).toFixed(2);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
      dispatch(fetchReviewsByProductIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (wishlistItemAddStatus === "fulfilled") {
      toast.success("Product added to wishlist");
    } else if (wishlistItemAddStatus === "rejected") {
      toast.error("Error adding product to wishlist, please try again later");
    }
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === "fulfilled") {
      toast.success("Product removed from wishlist");
    } else if (wishlistItemDeleteStatus === "rejected") {
      toast.error(
        "Error removing product from wishlist, please try again later"
      );
    }
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    if (productFetchStatus === "rejected") {
      toast.error("Error fetching product details, please try again later");
    }
  }, [productFetchStatus]);

  useEffect(() => {
    if (reviewFetchStatus === "rejected") {
      toast.error("Error fetching product reviews, please try again later");
    }
  }, [reviewFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductFetchStatus());
      dispatch(resetReviewFetchStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, []);

  const handleAddToCart = () => {
    const item = { product: id, quantity }; // Create item data
    if (loggedInUser && Object.keys(loggedInUser).length > 1) {
      // For logged-in users, use async thunk to add to server cart
      const itemWithUser = { ...item, user: loggedInUser._id };
      dispatch(addToCartAsync(itemWithUser));
    } else {
      console.log("product", product);
      // For guest users, add to cart directly in Redux
      dispatch(addProductToCart({ ...product, quantity }));
    }
    // setQuantity(1); // Reset quantity input field
  };

  const handleIncreaseQty = () => {
    if (loggedInUser && Object.keys(loggedInUser).length > 1) {
      // For logged-in users, update quantity on the server
      const update = { _id: id, quantity: quantity + 1 };
      dispatch(updateCartItemByIdAsync(update));
    } else {
      dispatch(addProductToCart(product)); // Dispatch update action to Redux for both logged-in and guest users
    }
  };

  const handleDecreaseQty = () => {
    if (quantity === 1) {
      if (loggedInUser && Object.keys(loggedInUser).length > 1) {
        dispatch(deleteCartItemByIdAsync(id)); // Remove from the server (logged-in)
      } else {
        // Remove from Redux store directly (guest users)
        dispatch(removeProductFromCart(product));
      }
    } else {
      if (loggedInUser && Object.keys(loggedInUser).length > 1) {
        const update = { _id: id, quantity: quantity - 1 };
        dispatch(updateCartItemByIdAsync(update)); // Update quantity on the server (logged-in)
      } else {
        // For guest users, update quantity directly in Redux store
        dispatch(decreaseProductQuantity(product));
      }
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddRemoveFromWishlist = (e) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: id };
      dispatch(createWishlistItemAsync(data));
    } else if (!e.target.checked) {
      const index = wishlistItems.findIndex((item) => item.product._id === id);
      dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
    }
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = product?.images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      {!(
        productFetchStatus === "rejected" && reviewFetchStatus === "rejected"
      ) && (
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            mb: "2rem",
            rowGap: "2rem",
          }}
        >
          {(productFetchStatus || reviewFetchStatus) === "pending" ? (
            <Stack
              width={is500 ? "35vh" : "25rem"}
              height={"calc(100vh - 4rem)"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Lottie animationData={loadingAnimation} />
            </Stack>
          ) : (
            <Stack>
              {/* product details */}
              <Stack
                width={is480 ? "'90%'" : is1420 ? "auto" : "88rem"}
                p={is480 ? 2 : 0}
                height={is840 ? "auto" : "50rem"}
                rowGap={5}
                mt={is840 ? 0 : 5}
                justifyContent={"center"}
                mb={5}
                flexDirection={is840 ? "column" : "row"}
                columnGap={is990 ? "2rem" : "5rem"}
                overflow={"auto"}
              >
                {/* left stack (images) */}
                <Stack
                  sx={{
                    flexDirection: "row",
                    columnGap: "2.5rem",
                    alignSelf: "flex-start",
                    height: "100%",
                  }}
                >
                  {/* image selection */}
                  {!is1420 && (
                    <Stack
                      sx={{
                        display: "flex",
                        rowGap: "1.5rem",
                        height: "100%",
                        overflowY: "scroll",
                      }}
                    >
                      {product &&
                        product.images.map((image, index) => (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 1 }}
                            style={{ width: "400px", cursor: "pointer" }}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img
                              style={{ width: "100%", objectFit: "contain" }}
                              src={image}
                              alt={`${product.title} image`}
                            />
                          </motion.div>
                        ))}
                    </Stack>
                  )}

                  <Stack mt={is480 ? "0rem" : "5rem"}>
                    {is1420 ? (
                      <Stack
                        width={is480 ? "250px" : is990 ? "400px" : "500px"}
                      >
                        <Slider {...sliderSettings}>
                          {product?.images.map((image, index) => (
                            <div key={index}>
                              <img
                                style={{
                                  width: "110%",
                                  objectFit: "contain",
                                  aspectRatio: 1 / 1,
                                }}
                                src={image}
                                alt={`${product?.title} image`}
                              />
                            </div>
                          ))}
                        </Slider>
                      </Stack>
                    ) : (
                      <div style={{ width: "100%" }}>
                        <img
                          style={{
                            width: "100%",
                            objectFit: "contain",
                            aspectRatio: 1 / 1,
                          }}
                          src={product?.images[selectedImageIndex]}
                          alt={`${product?.title} image`}
                        />
                      </div>
                    )}
                  </Stack>
                </Stack>

                {/* right stack - about product */}
                <Stack rowGap={"1.5rem"} width={is480 ? "90%" : "25rem"}>
                  {/* title rating price */}
                  <Stack rowGap={".5rem"}>
                    {/* title */}
                    <Typography variant="h4" fontWeight={600}>
                      {product?.title}
                    </Typography>
                    {/* rating */}
                    <Stack
                      sx={{
                        flexDirection: "row",
                        columnGap: ".5rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                        rowGap: "1rem",
                      }}
                    >
                      <Rating value={averageRating} readOnly />
                      <Typography>
                        ({" "}
                        {totalReviews === 0
                          ? "No reviews"
                          : totalReviews === 1
                          ? `${totalReviews} Review`
                          : `${totalReviews} Reviews`}{" "}
                        )
                      </Typography>
                      <Typography
                        color={
                          product?.stockQuantity <= 10
                            ? "error"
                            : product?.stockQuantity <= 20
                            ? "orange"
                            : "green"
                        }
                      >
                        {product?.stockQuantity <= 10
                          ? `Only ${product?.stockQuantity} left`
                          : product?.stockQuantity <= 20
                          ? "Only few left"
                          : "In Stock"}
                      </Typography>
                    </Stack>
                    {/* price */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        ₹{product?.price}
                      </Typography>
                      <Typography variant="h6" fontWeight={"bold"}>
                        ₹{discountedPrice}
                      </Typography>
                    </Stack>{" "}
                  </Stack>

                  {/* description */}
                  <Stack rowGap={".8rem"}>
                    <Typography>{product?.description}</Typography>
                    <hr />
                  </Stack>

                  {/* color, size and add-to-cart */}

                  {!loggedInUser?.isAdmin && (
                    <Stack sx={{ rowGap: "1.3rem" }} width={"fit-content"}>
                      {/* colors */}
                      <Stack
                        flexDirection={"row"}
                        alignItems={"center"}
                        columnGap={"5px"}
                        width={"fit-content"}
                      >
                        <Typography>Colors: </Typography>
                        <Stack flexDirection={"row"} columnGap={".5rem"}>
                          {COLORS.map((color, index) => (
                            <div
                              style={{
                                backgroundColor: "white",
                                border:
                                  selectedColorIndex === index
                                    ? `1px solid ${theme.palette.primary.dark}`
                                    : "",
                                width: "40px ",
                                height: "40px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "100%",
                              }}
                            >
                              <div
                                onClick={() => setSelectedColorIndex(index)}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  border:
                                    color === "#F6F6F6"
                                      ? "1px solid grayText"
                                      : "",
                                  backgroundColor: color,
                                  borderRadius: "100%",
                                }}
                              ></div>
                            </div>
                          ))}
                        </Stack>
                      </Stack>

                      {/* size */}
                      <Stack
                        flexDirection={"row"}
                        alignItems={"center"}
                        columnGap={"5px"}
                        width={"fit-content"}
                      >
                        <Typography>Size: </Typography>
                        <Stack flexDirection={"row"} columnGap={".5rem"}>
                          {SIZES.map((size) => (
                            <motion.div
                              onClick={() => handleSizeSelect(size)}
                              whileHover={{ scale: 1 }}
                              whileTap={{ scale: 1 }}
                              style={{
                                border:
                                  selectedSize === size
                                    ? ""
                                    : "1px solid grayText",
                                borderRadius: "8px",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: ".6rem",
                                backgroundColor:
                                  selectedSize === size
                                    ? "#DB4444"
                                    : "whitesmoke",
                                color: selectedSize === size ? "white" : "",
                              }}
                            >
                              <p>{size}</p>
                            </motion.div>
                          ))}
                        </Stack>
                      </Stack>

                      {/* quantity , add to cart and wishlist */}
                      <Stack
                        flexDirection={"row"}
                        columnGap={".3rem"}
                        width={"100%"}
                      >
                        

                        {/* add to cart */}
                        {isProductAlreadyInCart ? (
                          <button
                            style={{
                              padding: "10px 15px",
                              fontSize: "1.050rem",
                              backgroundColor: "black",
                              color: "white",
                              outline: "none",
                              border: "none",
                              borderRadius: "8px",
                            }}
                          >
                            In Cart
                          </button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1 }}
                            onClick={handleAddToCart}
                            style={{
                              padding: "10px 15px",
                              fontSize: "1.050rem",
                              backgroundColor: "black",
                              color: "white",
                              outline: "none",
                              border: "none",
                              borderRadius: "8px",
                            }}
                          >
                            Add To Cart
                          </motion.button>
                        )}

                        {/* wishlist */}
                        <motion.div
                          style={{
                            border: "1px solid grayText",
                            borderRadius: "4px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            checked={isProductAlreadyinWishlist}
                            onChange={(e) => handleAddRemoveFromWishlist(e)}
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite sx={{ color: "red" }} />}
                          />
                        </motion.div>
                      </Stack>
                    </Stack>
                  )}

                  {/* product perks */}
                  <Stack
                    mt={3}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px grayText solid",
                      borderRadius: "7px",
                    }}
                  >
                    <Stack
                      p={2}
                      flexDirection={"row"}
                      alignItems={"center"}
                      columnGap={"1rem"}
                      width={"100%"}
                      justifyContent={"flex-sart"}
                    >
                      <Box>
                        <LocalShippingOutlinedIcon />
                      </Box>
                      <Stack>
                        <Typography>Free Delivery</Typography>
                        <Typography>
                          Enter your postal for delivery availabity
                        </Typography>
                      </Stack>
                    </Stack>
                    <hr style={{ width: "100%" }} />
                    <Stack
                      p={2}
                      flexDirection={"row"}
                      alignItems={"center"}
                      width={"100%"}
                      columnGap={"1rem"}
                      justifyContent={"flex-start"}
                    >
                      <Box>
                        <CachedOutlinedIcon />
                      </Box>
                      <Stack>
                        <Typography>Return Delivery</Typography>
                        <Typography>Free 30 Days Delivery Returns</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              {/* reviews */}
              <Stack width={is1420 ? "80%" : "88rem"} p={0}>
                <Reviews productId={id} averageRating={averageRating} />
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
};
