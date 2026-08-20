'use client';

import { useAuth, AppRole } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, rolesLoading, roles } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !rolesLoading) {
      if (!user) {
        router.push("/login");
      } else if (requiredRole && !roles.includes(requiredRole)) {
        if (roles.includes("organisation")) router.push("/org");
        else if (roles.includes("teacher")) router.push("/teacher");
        else if (roles.includes("student")) router.push("/student");
        else router.push("/user");
      }
    }
  }, [user, loading, rolesLoading, roles, requiredRole, router]);

  // Wait for both auth AND roles to load — prevents race condition
  if (loading || rolesLoading) return <Spinner />;

  // Not logged in
  if (!user) return null;

  // Role check
  if (requiredRole && !roles.includes(requiredRole)) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
