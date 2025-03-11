import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

//Protects routes for authenticated users only
export const PrivateRoute = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  return authToken ? <Outlet /> : <Navigate to="/signup" />;
};


//Role-based route protection (for teachers, students, etc.)
export const RoleRoute = ({ allowedRoles }) => {
  const authToken = useSelector((state) => state.auth.authToken);
  const role = useSelector((state) => state.auth.role);

  if (!authToken) {
    return <Navigate to="/signup" />;
  }
  // If role is allowed, render the route, otherwise redirect to "/"
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" />;
};


//Admin-only route protection
export const AdminRoute = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  const role = useSelector((state) => state.auth.role);

  if (!authToken) {
    return <Navigate to="/adminlogin" />;
  }

  // If the user is not a staff/admin, redirect to home
  return role === "staff" ? <Outlet /> : <Navigate to="/" />;
};
