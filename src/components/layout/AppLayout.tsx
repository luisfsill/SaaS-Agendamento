import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { IOSTabBar } from "./IOSTabBar";
import { IOSLoadingPage } from "@/components/ui/ios-loading";

export function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <IOSLoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background pb-[80px]">
      <Outlet />
      <IOSTabBar />
    </div>
  );
}
