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
 import { fetchAllUser } from "../UserApi";
import { deleteMessages, deleteUsersAsync, fetchAllUserAsync, resetDeleteStatus, resetUpdateStatus, selectUserList } from "../UserSlice";
import { resetCreatedStatus, selectCreatedStatus } from "../../auth/AuthSlice";
  const Userlist = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

 

  const dispatch = useDispatch();
  const users = useSelector(selectUserList);
  const deleteMessage = useSelector(deleteMessages);
//   const productAddStatus = useSelector(selectCategoryStatus);
  const createdStatus = useSelector(selectCreatedStatus);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));  // Small: xs, sm (up to 600px)
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Medium: sm, md (600px to 960px)
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));  // Large: md and above (from 960px and up)

  useEffect(()=>{
    if(deleteMessage=='fulfilled'){
         toast.success("User deleted successfully");
         dispatch(fetchAllUserAsync());
         dispatch(resetDeleteStatus())
    }
    else if(deleteMessage=='rejected'){
        toast.error("Error in deleting user, please try again later")
    }
},[deleteMessage])

 
  const handleEdit = (id) => {
    navigate(`/admin/add-user?userId=${id}`);
  };
  

  const handleDelete = (id) => {
     dispatch(deleteUsersAsync(id))
  };

  useEffect(()=>{
    dispatch(fetchAllUserAsync());
  },[]);

  useEffect(() => {
    dispatch(fetchAllUserAsync());
    dispatch(resetCreatedStatus());
    dispatch(resetUpdateStatus());
    }, []);
    useEffect(() => {
      if(createdStatus ==='fulfilled'){
      dispatch(resetCreatedStatus());}
    }, [createdStatus, dispatch]);


 
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
            User List
          </Typography>
          <Button variant="contained" color="primary">
            <Typography
              component={Link}
              sx={{ textDecoration: "none", color: "white" }}
              to="/admin/add-user"
              textAlign="center"
            >
              Add User
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
                <TableCell sx={{ padding: isSmallScreen ? '8px' : '16px' }}>Email</TableCell>
                <TableCell sx={{ padding: isSmallScreen ? '8px' : '16px' }}>User Type</TableCell>
                <TableCell align="center" sx={{ padding: isSmallScreen ? '8px' : '16px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: isSmallScreen ? '8px' : '16px' }}>
                    {item.name}
                  </TableCell>
                  <TableCell sx={{ padding: isSmallScreen ? '8px' : '16px' }}>
                    {item.email}
                  </TableCell>
                  <TableCell sx={{ padding: isSmallScreen ? '8px' : '16px' }}>
                    {item.isAdmin ? 'Admin': 'User'}
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

export default Userlist;
