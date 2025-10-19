import Loader from "@/components/kokonutui/loader";
import { useAuthContext } from "@/context/auth-provider";
import React from "react";
import { Navigate } from "react-router-dom";

const LoginRoute = ({ children }) => {
  const { user, isLoading, error, isLoggingOut } = useAuthContext();
  
  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        <Loader 
          title="Authenticating"
          subtitle="Please wait while we verify your credentials"
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
  
  // If there's an auth error (like expired token), redirect to login
  if (error) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is authenticated, show protected content
  if (user) {
    return children;
  }
  
  // If no user and not loading, redirect to login
  return <Navigate to="/login" replace />;
};

export default LoginRoute;
