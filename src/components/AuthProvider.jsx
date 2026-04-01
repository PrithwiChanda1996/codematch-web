import React, { useEffect, useState, createContext, useContext } from "react";
import { useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

// Create context for auth loading state
const AuthLoadingContext = createContext({
  isAuthLoading: true,
  setIsAuthLoading: () => {},
});

// Export hook to use auth loading context
export const useAuthLoading = () => useContext(AuthLoadingContext);

const AuthProvider = ({ children }) => {
  const { restoreSession } = useAuth();
  const location = useLocation();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [initialPath] = useState(location.pathname);

  useEffect(() => {
    const initAuth = async () => {
      // Use initial path to determine if session restoration is needed
      // This prevents re-running when routes change during authentication
      const publicPaths = [
        "/",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
      ];
      const isPublicPage = publicPaths.includes(initialPath);

      if (!isPublicPage) {
        await restoreSession();
      }

      setIsAuthLoading(false);
    };

    initAuth();
  }, []); // Empty dependency array - only run once on mount

  return (
    <AuthLoadingContext.Provider value={{ isAuthLoading, setIsAuthLoading }}>
      {children}
    </AuthLoadingContext.Provider>
  );
};

export default AuthProvider;
