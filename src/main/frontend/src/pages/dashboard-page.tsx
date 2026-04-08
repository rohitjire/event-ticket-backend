import { useRoles } from "@/hooks/use-roles";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const DashboardPage: React.FC = () => {
  const { isLoading, isOrganizer, isStaff } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (isOrganizer) {
      navigate("/dashboard/events", { replace: true });
    } else if (isStaff) {
      navigate("/dashboard/validate-qr", { replace: true });
    } else {
      navigate("/dashboard/tickets", { replace: true });
    }
  }, [isLoading, isOrganizer, isStaff, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
