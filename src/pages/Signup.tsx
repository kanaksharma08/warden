
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import SignupForm from "@/components/ui/signup-form";

export default function Signup() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "HostelSphere | Sign Up";
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">HostelSphere</h1>
        <p className="text-muted-foreground mt-2">Hostel Management System</p>
      </div>
      <SignupForm />
    </div>
  );
}
