
import { useEffect, useState } from "react";
import { 
  UsersRound, 
  FileWarning, 
  Clock, 
  ArrowUpRight,
  CheckCircle2,
  XCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardCard from "@/components/dashboard/dashboard-card";
import StatsCard from "@/components/dashboard/stats-card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { WardenDashboardData } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Mock data for demonstration
const MOCK_DATA: WardenDashboardData = {
  pendingOutingRequests: 5,
  unresolvedComplaints: 8,
  activeStudents: 120,
  outingTrends: {
    "Jan": 25,
    "Feb": 30,
    "Mar": 22,
    "Apr": 35,
    "May": 42,
    "Jun": 28,
  },
  complaintTrends: {
    "Jan": 10,
    "Feb": 15,
    "Mar": 8,
    "Apr": 12,
    "May": 16,
    "Jun": 9,
  },
};

// Mock outing requests
const MOCK_OUTING_REQUESTS = [
  {
    id: "1",
    student: {
      id: "s1",
      name: "Alex Johnson",
      room: "203",
      avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff",
    },
    dateFrom: "2023-05-15T08:00:00Z",
    dateTo: "2023-05-15T20:00:00Z",
    reason: "Family visit",
    status: "pending",
  },
  {
    id: "2",
    student: {
      id: "s2",
      name: "Jamie Smith",
      room: "105",
      avatar: "https://ui-avatars.com/api/?name=Jamie+Smith&background=0D8ABC&color=fff",
    },
    dateFrom: "2023-05-16T09:00:00Z",
    dateTo: "2023-05-16T18:00:00Z",
    reason: "Medical appointment",
    status: "pending",
  },
  {
    id: "3",
    student: {
      id: "s3",
      name: "Taylor Wilson",
      room: "310",
      avatar: "https://ui-avatars.com/api/?name=Taylor+Wilson&background=0D8ABC&color=fff",
    },
    dateFrom: "2023-05-18T10:00:00Z",
    dateTo: "2023-05-18T16:00:00Z",
    reason: "College event",
    status: "pending",
  },
];

// Mock complaints
const MOCK_COMPLAINTS = [
  {
    id: "1",
    student: {
      id: "s1",
      name: "Alex Johnson",
      room: "203",
      avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff",
    },
    title: "Wi-Fi connectivity issue",
    description: "Unable to connect to Wi-Fi in Room 203",
    status: "pending",
    createdAt: "2023-05-08T09:15:00Z",
  },
  {
    id: "2",
    student: {
      id: "s4",
      name: "Riley Brown",
      room: "205",
      avatar: "https://ui-avatars.com/api/?name=Riley+Brown&background=0D8ABC&color=fff",
    },
    title: "Water leakage in bathroom",
    description: "There is water leakage from the shower in Room 205",
    status: "in-progress",
    createdAt: "2023-05-05T11:30:00Z",
  },
];

// Format data for charts
const formatOutingTrends = () => {
  return Object.entries(MOCK_DATA.outingTrends).map(([month, count]) => ({
    month,
    count,
  }));
};

const formatComplaintTrends = () => {
  return Object.entries(MOCK_DATA.complaintTrends).map(([month, count]) => ({
    month,
    count,
  }));
};

const formatCombinedTrends = () => {
  return Object.keys(MOCK_DATA.outingTrends).map((month) => ({
    month,
    outings: MOCK_DATA.outingTrends[month],
    complaints: MOCK_DATA.complaintTrends[month],
  }));
};

const WardenDashboard = () => {
  const [data, setData] = useState<WardenDashboardData | null>(null);
  const [outingRequests, setOutingRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setData(MOCK_DATA);
      setOutingRequests(MOCK_OUTING_REQUESTS);
      setComplaints(MOCK_COMPLAINTS);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-32 bg-muted rounded-lg"></div>
        ))}
        <div className="h-80 bg-muted rounded-lg md:col-span-2"></div>
        <div className="h-80 bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Warden Dashboard</h2>
          <p className="text-muted-foreground">
            Manage student outings, complaints, and hostel operations.
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button asChild variant="default">
            <Link to="/dashboard/notices">
              Post Notice
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Pending Outing Requests"
          value={data.pendingOutingRequests}
          description="Awaiting approval"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Unresolved Complaints"
          value={data.unresolvedComplaints}
          description="Require attention"
          icon={<FileWarning className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Students"
          value={data.activeStudents}
          description="Currently in hostel"
          icon={<UsersRound className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        <DashboardCard
          title="Student Activity Trends"
          description="Monthly outing and complaint trends"
          className="md:col-span-2"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formatCombinedTrends()}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="outings" name="Outings" fill="#0ea5e9" />
                <Bar dataKey="complaints" name="Complaints" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Quick Actions"
          description="Frequently used actions"
        >
          <div className="space-y-2">
            <Button className="w-full justify-start" asChild>
              <Link to="/dashboard/manage-outings">
                <Clock className="mr-2 h-4 w-4" />
                Manage Outing Requests
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/dashboard/manage-complaints">
                <FileWarning className="mr-2 h-4 w-4" />
                Handle Complaints
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/dashboard/students">
                <UsersRound className="mr-2 h-4 w-4" />
                View Student Directory
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/dashboard/notices">
                Post Hostel Notice
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/dashboard/messages">
                Send Message
              </Link>
            </Button>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <DashboardCard
          title="Pending Outing Requests"
          description="Requires your approval"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback>
                          {request.student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Room {request.student.room}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(request.dateFrom).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button variant="link" size="sm" className="px-0" asChild>
              <Link to="/dashboard/manage-outings" className="flex items-center">
                View all requests
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Recent Complaints"
          description="Requires your attention"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback>
                          {complaint.student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{complaint.student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Room {complaint.student.room}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{complaint.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {complaint.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        complaint.status === "resolved"
                          ? "default"
                          : complaint.status === "in-progress"
                          ? "outline"
                          : "secondary"
                      }
                      className={
                        complaint.status === "resolved"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/20 dark:text-green-300"
                          : complaint.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-800/20 dark:text-yellow-300"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800/20 dark:text-gray-300"
                      }
                    >
                      {complaint.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button variant="link" size="sm" className="px-0" asChild>
              <Link to="/dashboard/manage-complaints" className="flex items-center">
                View all complaints
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default WardenDashboard;
