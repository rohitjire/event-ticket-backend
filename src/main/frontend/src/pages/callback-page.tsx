import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const CallbackPage: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // onSigninCallback already replaced the URL to the target path,
      // but if we're still rendering this component, navigate as fallback
      navigate("/", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-400">Processing login...</p>
      </div>
    </div>
  );
};

export default CallbackPage;
