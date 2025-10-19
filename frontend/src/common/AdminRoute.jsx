import Loader from "@/components/kokonutui/loader";
import { useAuthContext } from "@/context/auth-provider";
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, isLoading, isLoggingOut } = useAuthContext();
  
  if (isLoading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        <Loader 
          title="Loading"
          subtitle="Please wait while we prepare the page"
          size="lg"
          fullScreen={true}
        />
      </div>
    );
  }
  
  // If user is logging out, don't redirect - let the logout process handle navigation
  if (isLoggingOut) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        <Loader 
          title="Logging out"
          subtitle="Please wait while we log you out"
          size="lg"
          fullScreen={true}
        />
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is not admin, redirect to home page
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  // If user is admin, show the admin page
  return children;
};

export default AdminRoute;

