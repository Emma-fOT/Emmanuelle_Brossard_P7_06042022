import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  // To add a checking of the roles:
  // https://www.youtube.com/watch?v=oUZjO00NkhY&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&index=3 21:00
  return currentUser?.user.role?.find((role) => allowedRoles?.includes(role)) ? (
    //If a user is logged in and has a role that is allowed, render the children
    <Outlet />
  ) : currentUser ? (
    //If a user is logged in, but not allowed to access the page, redirect to his dashboard
    <Navigate to="/dashboard" state={{ from: location }} replace />
  ) : (
    //If a user is not logged in, redirect to the home page
    <Navigate to="/" state={{ from: location }} replace />
  );
};
//The "from" state is used to redirect the user to the page he was on before he logged in if he wants to go back to his previous page.

export default ProtectedRoute;
