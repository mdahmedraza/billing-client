import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth pages
import Login from "./pages/auth/Login";
import EnterOTP from "./pages/auth/EnterOTP";
import SetPassword from "./pages/auth/SetPassword";
import Signup from "./pages/auth/Signup";
import ProductPublic from "./pages/auth/ProductPublic";

// Protected auth helper
import RequireAuth from "./pages/auth/RequireAuth";

// Admin Layout & Pages
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductAdmin from "./pages/admin/ProductAdmin";
import Users from "./pages/admin/Users";

// Other pages
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";

const App = () => {
  const auth = useSelector((state) => state.AuthSlice);
  console.log("this is the auth details in App.js......", auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/otp" element={<EnterOTP />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/product-public/:id" element={<ProductPublic />} />
      <Route path="/product-public" element={<ProductPublic />} />

      {/* Access denied page for authenticated users without required role */}

      {/* Protected Admin routes: only ADMIN role allowed */}
      {/* <Route
        path="/admin/*"
        element={
          <RequireAuth allowedRoles={["OWNER"]}>
            <AdminLayout />
          </RequireAuth>
        }
      >
           <Route index element={<Dashboard />} />
           <Route path="dashboard" element={<Dashboard />} />

           <Route path="products" element={<Products />} />
           <Route path="users" element={<Users />} />
      </Route> */}
      <Route
  path="/admin/*"
  element={
    <RequireAuth allowedRoles={["OWNER"]}>
      <AdminLayout />
    </RequireAuth>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="products" element={<Products />} />
  <Route path="users" element={<Users />} />
</Route>

          {/* <Route path="/user/*" element={
            <RequireAuth allowedRoles={['ADMIN']}>
              <UserLayout />
            </RequireAuth>
          }>

      </Route> */}
      <Route 
  path="/user/*" 
  element={
    <RequireAuth allowedRoles={["ADMIN"]}>
      <UserLayout />
    </RequireAuth>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="products" element={<ProductAdmin />} />
</Route>

     
      <Route path="/access-denied" element={<AccessDenied />} />


      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;



// http://192.168.1.4:3000 