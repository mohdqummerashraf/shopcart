import { useTheme } from "@emotion/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Avatar,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserAsync, resetCreatedStatus, resetSignupStatus, selectCreatedStatus, selectSignupStatus, signupAsync } from "../../auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function EditUser() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();


  const [userInfo, setUserInfo] = useState([]);

  const [showPassword, setShowPassword] = useState(true);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const createdStatus= useSelector(selectCreatedStatus);

  useEffect(() => {
    if (createdStatus === "fulfilled" ) {
      reset(); // Reset the form
      toast.success("New user added");
      navigate("/admin/user-list");
    } else if (createdStatus === "rejected") {
      toast.error("Error adding user, please try again later");
      dispatch(resetCreatedStatus()); // Reset status
    }
  }, [createdStatus]);

  const handleFormSubmit = (data) => {
    const cred = { ...data };
    cred.isVerified=true;
    dispatch(createUserAsync(cred));
  };

  return (
    <Stack
      height={"calc(100vh - 4rem)"}
      justifyContent={"flex-start"}
      alignItems={"center"}
    >
      <Stack
        component={is480 ? "" : Paper}
        elevation={1}
        width={is900 ? "100%" : "50rem"}
        p={2}
        mt={is480 ? 0 : 5}
        rowGap={2}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* User details - [name, email, admin] */}
          <Stack
            bgcolor={theme.palette.primary.light}
            color={theme.palette.primary.main}
            p={2}
            rowGap={1}
            borderRadius={".6rem"}
            justifyContent={"center"}
            alignItems={"left"}
          >
            {/* Name field */}
            <Typography align="left">Name</Typography>
            <TextField
              placeholder="Enter your name"
              defaultValue={userInfo?.name}
              {...register("name", { required: true })}
              fullWidth
            />

            {/* Email field */}
            <Typography align="left">Email</Typography>
            <TextField
              placeholder="Enter your email"
              type="email"
              defaultValue={userInfo?.email}
              {...register("email", { required: true })}
              fullWidth
            />

            {/* Password field with show/hide functionality */}
            <Typography align="left">Password</Typography>
            <TextField
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Admin field and Submit button aligned horizontally */}
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              width={"100%"}
            >
              <FormControl variant="outlined" size="small">
                <Typography align="left">Admin</Typography>
                <Select
                  native
                  defaultValue={userInfo?.isAdmin ? "true" : "false"}
                  {...register("isAdmin", { required: true })}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </Select>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                width={"30%"}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
}

export default EditUser;
