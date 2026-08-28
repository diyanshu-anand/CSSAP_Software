import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = getRole();

  if (!role) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;