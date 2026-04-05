import { ReactNode, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useLocation } from "react-router";

interface ProtectedRouteProperties {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProperties> = ({ children }) => {
   const { isLoading, isAuthenticated, signinRedirect } = useAuth();
  const location = useLocation();

    useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store attempted URL (including hash) before redirecting to Keycloak
      const fullPath = location.pathname + location.search + (location.hash || "");
      localStorage.setItem("redirectPath", fullPath);
      signinRedirect(); // Redirects directly to Keycloak login
    }
  }, [isLoading, isAuthenticated, location, signinRedirect]);

  if (isLoading || (!isAuthenticated && typeof window !== "undefined")) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
