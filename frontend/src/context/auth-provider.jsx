import { createContext, useContext, useEffect, useState } from "react";

import useAuth from "@/hooks/use-auth";
import { useStore } from "@/store/store";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Use Zustand store with proper selector
  const accessToken = useStore.use.accessToken();
  
  const {
    data: authData,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();

  // If no access token, user should be null regardless of cached data
  const user = accessToken ? authData : null;

  // Ensure store is ready before proceeding
  useEffect(() => {
    setIsStoreReady(true);
  }, []);

  // If we have a token but no user data and no error, we're still loading
  const isActuallyLoading = !isStoreReady || (accessToken && !user && !authError) || isLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        error: authError,
        isLoading: isActuallyLoading,
        isFetching,
        refetchAuth,
        isLoggingOut,
        setIsLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
