import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-navy text-foreground">
        <div className="text-sm text-muted-foreground">Checking session…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
