import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);


  if (token) {
    return <Navigate to="/welcome" />;
  }

  return children;
};

export default PublicRoute;
