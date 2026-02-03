import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children, allowedRoles = [] }) => {
  const auth = useSelector((state) => state.AuthSlice);
  const location = useLocation();

  const userRole = auth?.role;

  // If not logged in → go to login
  if (!auth?.isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If no valid role → access denied
  if (!userRole) {
    return <Navigate to="/access-denied" replace />;
  }

  // Redirect based on valid roles
  if (userRole === "OWNER") {
    // If OWNER trying to open USER dashboard
    if (!allowedRoles.includes("OWNER")) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  if (userRole === "ADMIN") {
    // If ADMIN trying to open ADMIN dashboard
    if (!allowedRoles.includes("ADMIN")) {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // If allowedRoles doesn't include user's role → access-denied
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default RequireAuth;








// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate, useLocation } from "react-router-dom";

// const RequireAuth = ({ children, allowedRoles = [] }) => {
//   const auth = useSelector((state) => state.AuthSlice);
//   const location = useLocation();

//   // if not logged in -> go to login
//   if (!auth?.isLoggedIn) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   // if allowedRoles provided and user's role not included -> access denied
//   if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
//     const userRole = auth?.role || "";
//     const roleAllowed = allowedRoles.includes(userRole);
//     if (!roleAllowed) {
//       // return <Navigate to="/user/*" state={{ from: location }} replace />;
//       return <Navigate to="/access-denied" state={{ from: location }} replace />;
//     }
//   }

//   // ok
//   return children;
// };

// export default RequireAuth;



