import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.user_type)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
