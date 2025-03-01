
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import AuthForm from "@/components/ui/auth-form";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    document.title = "HostelSphere | Login";
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">HostelSphere</h1>
          <p className="text-muted-foreground">Hostel Management System</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Index;
