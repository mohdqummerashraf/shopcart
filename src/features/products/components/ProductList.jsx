import {
  FormControl,
  Grid,
  IconButton,
  Pagination,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Grid2,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectProductIsFilterOpen,
  selectProductTotalResults,
  selectProducts,
  toggleFilters,
} from "../ProductSlice";
import { ProductCard } from "./ProductCard";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";
import { selectBrands } from "../../brands/BrandSlice";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { selectCategories } from "../../categories/CategoriesSlice";
import { ITEMS_PER_PAGE } from "../../../constants";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { toast } from "react-toastify";
import {
  banner1,
  banner2,
  banner3,
  banner4,
  loadingAnimation,
} from "../../../assets";
import {
  resetCartItemAddStatus,
  selectCartItemAddStatus,
} from "../../cart/CartSlice";
import { motion } from "framer-motion";
import { ProductBanner } from "./ProductBanner";
import ClearIcon from "@mui/icons-material/Clear";
import Lottie from "lottie-react";

const sortOptions = [
  { name: "Price: low to high", sort: "price", order: "asc" },
  { name: "Price: high to low", sort: "price", order: "desc" },
];

const bannerImages = [banner1, banner3, banner2, banner4];

export const ProductList = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const theme = useTheme();

  const is1200 = useMediaQuery(theme.breakpoints.down(1200));
  const is800 = useMediaQuery(theme.breakpoints.down(800));
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is488 = useMediaQuery(theme.breakpoints.down(488));

  const brands = useSelector(selectBrands) || [];
  const categories = useSelector(selectCategories) || [];
  const products = useSelector(selectProducts) || [];
  const totalResults = useSelector(selectProductTotalResults) || 0;
  const loggedInUser = useSelector(selectLoggedInUser);
  const productFetchStatus = useSelector(selectProductFetchStatus);
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
  // const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

  const dispatch = useDispatch();

  const handleBrandFilters = (e) => {
    const filterSet = new Set(filters.brand || []);
    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }
    setFilters({ ...filters, brand: Array.from(filterSet) });
  };

  const handleCategoryFilters = (e) => {
    const filterSet = new Set(filters.category || []);
    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }
    setFilters({ ...filters, category: Array.from(filterSet) });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [totalResults]);

  useEffect(() => {
    const finalFilters = { ...filters };
    finalFilters.pagination = { page, limit: ITEMS_PER_PAGE };
    finalFilters.sort = sort;

    if (!loggedInUser?.isAdmin) {
      finalFilters.user = true;
    }

    dispatch(fetchProductsAsync(finalFilters));
  }, [filters, page, sort, loggedInUser, dispatch]);

  const handleAddRemoveFromWishlist = (e, productId) => {
    const data = { user: loggedInUser?._id, product: productId };
    
    if (e.target.checked) {
        dispatch(createWishlistItemAsync(data));
    } else {
        const index = wishlistItems.findIndex((item) => {
            
            return item?.product?._id === productId;
        });

        
        
        if (index !== -1) {
            dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
        }
    }
};


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

  // useEffect(() => {
  //   if (cartItemAddStatus === "fulfilled") {
  //     toast.success("Product added to cart");
  //   } else if (cartItemAddStatus === "rejected") {
  //     toast.error("Error adding product to cart, please try again later");
  //   }
  // }, [cartItemAddStatus]);

  useEffect(() => {
    if (productFetchStatus === "rejected") {
      toast.error("Error fetching products, please try again later");
    }
  }, [productFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetProductFetchStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, [dispatch]);

  const handleFilterClose = () => {
    dispatch(toggleFilters());
  };

 
  return (
    <>
      {productFetchStatus === "pending" ? (
        <Stack
          width={is500 ? "35vh" : "25rem"}
          height={"calc(100vh - 4rem)"}
          justifyContent={"center"}
          marginX={"auto"}
        >
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : (
        <>
          <motion.div
            style={{
              position: "fixed",
              backgroundColor: "white",
              height: "100vh",
              padding: "1rem",
              overflowY: "auto",
              width: is500 ? "90vw" : "30rem",
              zIndex: 500,
            }}
            variants={{ show: { left: 0 }, hide: { left: -500 } }}
            initial={"hide"}
            transition={{ ease: "easeInOut", duration: 0.7, type: "spring" }}
            animate={isProductFilterOpen ? "show" : "hide"}
          >
            <Stack mb={"10rem"} sx={{ overflowY: "hide" }}>
              <Typography variant="h4">New Arrivals</Typography>
              <IconButton
                onClick={handleFilterClose}
                style={{ position: "absolute", top: 15, right: 15 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ClearIcon fontSize="medium" />
                </motion.div>
              </IconButton>

              {/* <Stack rowGap={2} mt={4}>
                {["Backpacks", "Handbag", "Trolley Bags", "Laptop Bag"].map(
                  (item) => (
                    <Typography
                      key={item}
                      sx={{ cursor: "pointer" }}
                      variant="body2"
                    >
                      {item}
                    </Typography>
                  )
                )}
              </Stack> */}

              <Stack mt={2}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<AddIcon />}
                    aria-controls="brand-filters"
                    id="brand-filters"
                  >
                    <Typography>Brands</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleBrandFilters}>
                      {brands.map((brand) => (
                        <motion.div
                          key={brand._id}
                          style={{ width: "fit-content" }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FormControlLabel
                            sx={{ ml: 1 }}
                            control={<Checkbox />}
                            label={brand.name}
                            value={brand._id}
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>

              <Stack mt={2}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<AddIcon />}
                    aria-controls="category-filters"
                    id="category-filters"
                  >
                    <Typography>Category</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleCategoryFilters}>
                      {categories.map((category) => (
                        <motion.div
                          key={category._id}
                          style={{ width: "fit-content" }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FormControlLabel
                            sx={{ ml: 1 }}
                            control={<Checkbox />}
                            label={category.name}
                            value={category._id}
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Stack>
          </motion.div>

          <ProductBanner images={bannerImages} />
          <Stack
            mt={2}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h5" alignItems={'center'} marginLeft={'2rem'}>{totalResults} Results</Typography>
            <Stack direction={"row"} alignItems={"center"}>
              <Typography mr={1}>Sort by</Typography>
              <FormControl size="small">
                <Select
                  sx={{ borderRadius: 0 }}
                  onChange={(e) => setSort(e.target.value)}
                  value={sort}
                  displayEmpty
                >
                  <MenuItem disabled value="">
                    <em>Sort</em>
                  </MenuItem>
                  {sortOptions.map((opt, i) => (
                    <MenuItem key={i} value={opt}>
                      {opt.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <Grid2
            container
            spacing={2}
            mt={1}
            justifyContent="center"
            alignItems="center"
          >
            {products.map((product) => (
              <Grid2 item key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                <ProductCard
                  product={product}
                  handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                />
              </Grid2>
            ))}
          </Grid2>

          <Stack
            mt={5}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"row"}
          >
            <Pagination
              count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
              page={page}
              onChange={(e, val) => setPage(val)}
            />
          </Stack>
        </>
      )}
    </>
  );
};
