
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StudentDashboard from "@/pages/dashboard/student/index";
import WardenDashboard from "@/pages/dashboard/warden/index";
import AdminDashboard from "@/pages/dashboard/admin/index";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "HostelSphere | Dashboard";
  }, []);

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <DashboardLayout>
      {user.role === "student" && <StudentDashboard />}
      {user.role === "warden" && <WardenDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
