import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// Accept a prop to require auth
function Layout({ requireAuth = false }) {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  // Redirect if auth is required and user is not logged in
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
