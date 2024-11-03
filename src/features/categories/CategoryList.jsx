import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Delete, Edit } from "@mui/icons-material";
import {
  useMediaQuery,
  useTheme,
  IconButton,
  
  Stack,
  Button,
  Typography,
   
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { toast } from "react-toastify";
import { deleteCategoriesAsync, deleteMessages, fetchAllCategoriesAsync, resetCreateStatus, resetDeleteStatus, resetUpdateStatus, selectCategories, selectCategoryStatus } from "./CategoriesSlice";
 const CategoryList = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

 

  const dispatch = useDispatch();
  const category = useSelector(selectCategories);
  const deleteMessage = useSelector(deleteMessages);
  const productAddStatus = useSelector(selectCategoryStatus);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));  // Small: xs, sm (up to 600px)
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Medium: sm, md (600px to 960px)
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));  // Large: md and above (from 960px and up)

  useEffect(()=>{
      if(deleteMessage=='fulfilled'){
           toast.success("Category deleted successfully");
           dispatch(fetchAllCategoriesAsync());
           dispatch(resetDeleteStatus())
      }
      else if(deleteMessage=='rejected'){
          toast.error("Error in deleting product, please try again later")
      }
  },[deleteMessage])

 
  const handleEdit = (id) => {
    navigate(`/admin/create-category?categoryId=${id}`);
  };
  

  const handleDelete = (id) => {
     dispatch(deleteCategoriesAsync(id))
  };

  useEffect(() => {
    dispatch(fetchAllCategoriesAsync());
    // dispatch(resetCreateStatus());
    dispatch(resetUpdateStatus());
    }, []);
    useEffect(() => {
      if (productAddStatus === "fulfilled" || productAddStatus === "rejected") {
        // Reset create status to idle after processing
        dispatch(resetCreateStatus());
      }
    }, [productAddStatus, dispatch]);
    

 
  return (
    <>
     <Stack
      width="100%"
      height="100vh" // Full viewport height to center vertically
      alignItems="center"
    >
      {/* item List */}
      <Stack 
        width={isSmallScreen ? "100%" : isMediumScreen ? "80%" : "60rem"} 
        mt={4} 
        px={isSmallScreen ? 2 : isMediumScreen ? 3 : 0} // Responsive padding
      >
        <Stack
          direction="row"
          justifyContent="space-between" // Align heading to the left and button to the right
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" gutterBottom>
            Category List
          </Typography>
          <Button variant="contained" color="primary">
            <Typography
              component={Link}
              sx={{ textDecoration: "none", color: "white" }}
              to="/admin/create-category"
              textAlign="center"
            >
              Add Category
            </Typography>
          </Button>
        </Stack>

        <TableContainer 
          component={Paper} 
          sx={{ 
            padding: isSmallScreen ? 1 : 2, // Adjust padding for small screen
            marginBottom: isSmallScreen ? 2 : 0 // Add margin at the bottom for small screen
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: isSmallScreen ? '8px' : '16px' }}>Name</TableCell>
                <TableCell sx={{ padding: isSmallScreen ? '8px' : '16px' }}>Description</TableCell>
                <TableCell align="center" sx={{ padding: isSmallScreen ? '8px' : '16px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {category?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: isSmallScreen ? '8px' : '16px' }}>
                    {item.name}
                  </TableCell>
                  <TableCell sx={{ padding: isSmallScreen ? '8px' : '16px' }}>
                    {item.description}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: isSmallScreen ? '8px' : '16px' }}>
                    <Stack
                      flexDirection="row"
                      justifyContent="center"
                      alignItems="center"
                      columnGap={2}
                    >
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEdit(item._id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  
 

    </>
  );
};

export default CategoryList;
