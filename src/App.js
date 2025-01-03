import { useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import {
   selectLoggedInUser,
} from './features/auth/AuthSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
 import { useFetchLoggedInUserDetails } from './hooks/useAuth/useFetchLoggedInUserDetails';
import {
  AddProductPage,
  Adduserpage,
  AdminOrdersPage,
  BrandlistPage,
  CartPage,
  CheckoutPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  OrderSuccessPage,
  OtpVerificationPage,
  ProductDetailsPage,
  ProductUpdatePage,
  ResetPasswordPage,
  SignupPage,
  Userlistpage,
  UserOrdersPage,
  UserProfilePage,
  WishlistPage,
} from './pages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CreateCategoryPage } from './pages/CreateCategoryPage';
import { CreateBrandPage } from './pages/CreateBrandPage';
import { CategorylistPage } from './pages/CategorylistPage';

function App() {
   const loggedInUser = useSelector(selectLoggedInUser);

   useFetchLoggedInUserDetails(loggedInUser);

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:userId/:passwordResetToken" element={<ResetPasswordPage />} />  
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/wishlist" element={<WishlistPage/>} />

        <Route exact path='/product-details/:id' element={<ProductDetailsPage/>}/>
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        {loggedInUser?.isAdmin ? (
          // Admin routes
          <>
            <Route path="/admin/dashboard" element={<Protected><AdminDashboardPage /></Protected>} />
            <Route path="/admin/product-update/:id" element={<Protected><ProductUpdatePage /></Protected>} />
            <Route path="/admin/add-product" element={<Protected><AddProductPage /></Protected>} />
            <Route path="/admin/orders" element={<Protected><AdminOrdersPage /></Protected>} />
            <Route path="/admin/create-brand" element={<Protected><CreateBrandPage /></Protected>} />
            <Route path="/admin/brand-list" element={<Protected><BrandlistPage /></Protected>} />
            <Route path="/admin/create-category" element={<Protected><CreateCategoryPage /></Protected>} />
            <Route path="/admin/category-list" element={<Protected><CategorylistPage /></Protected>} />
            <Route path="/admin/add-user" element={<Protected><Adduserpage /></Protected>} />
            <Route path="/admin/user-list" element={<Protected><Userlistpage /></Protected>} />
            <Route path="/profile" element={<Protected><UserProfilePage /></Protected>} />

            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </>
        ) : (
          // Regular User routes
          <>
             <Route path="/profile" element={<Protected><UserProfilePage /></Protected>} />
            <Route path="/checkout" element={<Protected><CheckoutPage /></Protected>} />
            <Route path="/order-success/:id" element={<Protected><OrderSuccessPage /></Protected>} />
            <Route path="/orders" element={<Protected><UserOrdersPage /></Protected>} />
           </>
        )}

        
         

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );

  return  <RouterProvider router={routes} />
}

export default App;
