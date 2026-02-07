import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAdmin from "@/hooks/useAdmin";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-navy text-foreground">
        <div className="text-sm text-muted-foreground">Checking admin access…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
