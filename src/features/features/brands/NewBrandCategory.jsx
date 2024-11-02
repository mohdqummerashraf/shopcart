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
  brandDetail,
  createBrandsAsync,
  editBrandAsync,
  getBrandAsync,
  resetBrandStatus,
  selectCreateBrandStatus,
  updateStatus,
} from "./BrandSlice";

const NewBrandCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const createBrandsStatus = useSelector(selectCreateBrandStatus);
  const updateStatusMessage = useSelector(updateStatus);
  const brandData = useSelector(brandDetail);
  const navigate = useNavigate();
  const location = useLocation();

  // Create a helper to parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const brandId = queryParams.get("brandId");
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (createBrandsStatus === "fulfilled" || updateStatusMessage=="fulfilled") {
      reset(); // Reset the form
      toast.success("New brand added");
      navigate("/admin/brand-list");
    } else if (createBrandsStatus === "rejected" || updateStatusMessage=="rejected") {
      toast.error("Error adding brand, please try again later");
      dispatch(resetBrandStatus()); // Reset status
    }
  }, [createBrandsStatus, updateStatusMessage, reset, navigate, dispatch]);

  const handleAddProduct = async(data) => {
    console.log("data.....", data)
    if (brandData !== null) {
    //   dispatch(editBrandAsync(brandData?._id, data));
      try {
        const updatedBrand = await dispatch(editBrandAsync({ id: brandData?._id, data: data }));
        if (updatedBrand.meta.requestStatus === 'fulfilled') {
            console.log("Brand updated successfully:", updatedBrand.payload);
        }
    } catch (error) {
        console.error("Error updating brand:", error);
    }
    } else {
      dispatch(createBrandsAsync(data));
    }
  };

  useEffect(() => {
    if (brandId) {
      dispatch(getBrandAsync(brandId));
    }
  }, [brandId, dispatch]);

  // Reset form values when brandData changes
  useEffect(() => {
    if (brandData) {
      reset({
        name: brandData.name,
        description: brandData.description,
      });
    }
  }, [brandData, reset]);

  return (
    <Stack
      p={"0 16px"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"row"}
    >
      <Stack
        width={is1100 ? "100%" : "60rem"}
        rowGap={4}
        mt={is480 ? 4 : 6}
        mb={6}
        component={"form"}
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
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
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
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ""}
            />
          </Stack>
        </Stack>

        {/* Action area */}
        <Stack
          flexDirection={"row"}
          alignSelf={"flex-end"}
          columnGap={is480 ? 1 : 2}
        >
          {brandData !== null ? (
            <Button
              size={is480 ? "medium" : "large"}
              variant="contained"
              type="submit"
              disabled={createBrandsStatus === "loading"}
            >
              {createBrandsStatus === "loading" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Brand"
              )}
            </Button>
          ) : (
            <Button
              size={is480 ? "medium" : "large"}
              variant="contained"
              type="submit"
              disabled={createBrandsStatus === "loading"}
            >
              {createBrandsStatus === "loading" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Brand"
              )}
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NewBrandCategory;
