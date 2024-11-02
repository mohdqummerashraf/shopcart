import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  categoryDetail,
  createCategoriesAsync,
  editCategoryAsync,
  getCategoryAsync,
  resetCreateStatus,
  resetUpdateStatus,
  selectCategoryStatus,
  updateStatus,
} from "./CategoriesSlice";
 
const NewCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const productAddStatus = useSelector(selectCategoryStatus);
  const updateStatusMessage = useSelector(updateStatus);

  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const categoryId = queryParams.get("categoryId");
  const categoryData = useSelector(categoryDetail);

 

  useEffect(() => {
    if (productAddStatus === "fulfilled" || updateStatusMessage === "fulfilled") {
      reset();
      toast.success("Category operation successful");
      navigate("/admin/category-list");
    } else if (productAddStatus === "rejected" || updateStatusMessage === "rejected") {
      toast.error("Error in category operation, please try again later");
      dispatch(resetCreateStatus());
      dispatch(resetUpdateStatus());
    }
  }, [productAddStatus, updateStatusMessage, reset, navigate, dispatch]);

  const handleAddProduct = async (data) => {
    if (categoryData) {
      try {
        const updateCategory = await dispatch(
          editCategoryAsync({ id: categoryData._id, data })
        );
        if (updateCategory.meta.requestStatus === "fulfilled") {
          console.log("Category updated successfully:", updateCategory.payload);
        }
      } catch (error) {
        console.error("Error updating category:", error);
      }
    } else {
      dispatch(createCategoriesAsync(data));
    }
  };

  useEffect(() => {
    if (categoryId) {
      dispatch(getCategoryAsync(categoryId));
    }
  }, [categoryId, dispatch]);

  useEffect(() => {
    if (categoryData) {
      reset({
        name: categoryData.name,
        description: categoryData.description,
      });
    }
  }, [categoryData, reset]);

  console.log("categoryData", categoryData)

  return (
    <Stack
      p="0 16px"
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
    >
      <Stack
        width={is1100 ? "100%" : "60rem"}
        rowGap={4}
        mt={is480 ? 4 : 6}
        mb={6}
        component="form"
        noValidate
        onSubmit={handleSubmit(handleAddProduct)}
      >
        {/* Field area */}
        <Stack rowGap={3}>
          <Stack>
            <Typography variant="h6" fontWeight={400} gutterBottom>
              Title
            </Typography>
            <TextField
              {...register("name", { required: "Name is required" })}
            />
          </Stack>

          <Stack>
            <Typography variant="h6" fontWeight={400} gutterBottom>
              Description
            </Typography>
            <TextField
              multiline
              rows={4}
              {...register("description", {
                required: "Description is required",
              })}
            />
          </Stack>
        </Stack>

        {/* Action area */}
        <Stack
          flexDirection="row"
          alignSelf="flex-end"
          columnGap={is480 ? 1 : 2}
        >
          <Button
            size={is480 ? "medium" : "large"}
            variant="contained"
            type="submit"
            disabled={productAddStatus === "loading"}
          >
            {productAddStatus === "loading" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              categoryData ? "Update Category" : "Add Category"
            )}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NewCategory;
