'use client';

import { redirect } from 'next/navigation';

import { useAuth } from "@/contexts/AuthContext";

const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
  </div>
);

const DashboardRedirect = () => {
  const { roles, loading, rolesLoading } = useAuth();
  if (loading || rolesLoading) return <Spinner />;
  if (roles.includes("organisation")) return redirect("/org");
  if (roles.includes("teacher"))      return redirect("/teacher");
  if (roles.includes("student"))      return redirect("/student");
  return redirect("/user");
};

export default DashboardRedirect;
