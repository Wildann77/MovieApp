import Loader from "@/components/kokonutui/loader";
import { useAuthContext } from "@/context/auth-provider";
import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const { user, isLoading } = useAuthContext();
  
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
  
  // If user is already logged in, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // If no user, show the auth page (login/signup)
  return children;
};

export default AuthRoute;
