
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/lib/types";
import {
  Home,
  FileWarning,
  Clock,
  CreditCard,
  UserCircle,
  Megaphone,
  CheckSquare,
  UsersRound,
  Building,
  PieChart,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Common Items
  { 
    title: "Dashboard", 
    path: "/dashboard", 
    icon: Home, 
    roles: ["student", "warden", "admin"] 
  },
  
  // Student Items
  { 
    title: "Complaints", 
    path: "/dashboard/complaints", 
    icon: FileWarning, 
    roles: ["student"] 
  },
  { 
    title: "Outing Requests", 
    path: "/dashboard/outings", 
    icon: Clock, 
    roles: ["student"] 
  },
  { 
    title: "Fee Payments", 
    path: "/dashboard/fees", 
    icon: CreditCard, 
    roles: ["student"] 
  },
  { 
    title: "Room Details", 
    path: "/dashboard/room", 
    icon: Building, 
    roles: ["student"] 
  },
  { 
    title: "Communication", 
    path: "/dashboard/messages", 
    icon: MessageSquare, 
    roles: ["student", "warden", "admin"] 
  },
  
  // Warden Items
  { 
    title: "Student Management", 
    path: "/dashboard/students", 
    icon: UserCircle, 
    roles: ["warden", "admin"] 
  },
  { 
    title: "Manage Outings", 
    path: "/dashboard/manage-outings", 
    icon: CheckSquare, 
    roles: ["warden"] 
  },
  { 
    title: "Manage Complaints", 
    path: "/dashboard/manage-complaints", 
    icon: FileWarning, 
    roles: ["warden", "admin"] 
  },
  { 
    title: "Notices", 
    path: "/dashboard/notices", 
    icon: Megaphone, 
    roles: ["warden", "admin"] 
  },
  
  // Admin Items
  { 
    title: "User Management", 
    path: "/dashboard/users", 
    icon: UsersRound, 
    roles: ["admin"] 
  },
  { 
    title: "Room Management", 
    path: "/dashboard/rooms", 
    icon: Building, 
    roles: ["admin"] 
  },
  { 
    title: "Fee Collection", 
    path: "/dashboard/fee-collection", 
    icon: CreditCard, 
    roles: ["admin"] 
  },
  { 
    title: "Analytics", 
    path: "/dashboard/analytics", 
    icon: PieChart, 
    roles: ["admin"] 
  },
  
  // Common Settings
  { 
    title: "Settings", 
    path: "/dashboard/settings", 
    icon: Settings, 
    roles: ["student", "warden", "admin"] 
  },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredNavItems = navItems.filter(
    (item) => user?.role && item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">HostelSphere</h2>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={logout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
