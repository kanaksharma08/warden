
import { useEffect, useState } from "react";
import { 
  UsersRound, 
  Building, 
  CreditCard, 
  PieChart,
  ArrowUpRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/dashboard/dashboard-card";
import StatsCard from "@/components/dashboard/stats-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { AdminDashboardData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock data for demonstration
const MOCK_DATA: AdminDashboardData = {
  totalStudents: 350,
  availableRooms: 45,
  feeCollectionStatus: {
    paid: 280,
    pending: 50,
    overdue: 20,
  },
  complaintTrends: {
    "Jan": 10,
    "Feb": 15,
    "Mar": 8,
    "Apr": 12,
    "May": 16,
    "Jun": 9,
  },
  outingTrends: {
    "Jan": 25,
    "Feb": 30,
    "Mar": 22,
    "Apr": 35,
    "May": 42,
    "Jun": 28,
  },
  feePaymentTrends: {
    "Jan": 110000,
    "Feb": 150000,
    "Mar": 180000,
    "Apr": 130000,
    "May": 160000,
    "Jun": 120000,
  },
};

// Mock data for room allocation
const MOCK_ROOM_ALLOCATION = [
  { name: "Occupied", value: 305 },
  { name: "Available", value: 45 },
];

// Mock data for fee collection status
const MOCK_FEE_STATUS = [
  { name: "Paid", value: 280 },
  { name: "Pending", value: 50 },
  { name: "Overdue", value: 20 },
];

// Mock data for recent fee payments
const MOCK_RECENT_PAYMENTS = [
  { id: 1, student: "Alex Johnson", amount: 15000, date: "2023-05-10", status: "completed" },
  { id: 2, student: "Jamie Smith", amount: 15000, date: "2023-05-09", status: "completed" },
  { id: 3, student: "Riley Brown", amount: 15000, date: "2023-05-08", status: "completed" },
  { id: 4, student: "Taylor Wilson", amount: 15000, date: "2023-05-07", status: "completed" },
];

// Format data for charts
const formatTrends = (trends: Record<string, number>) => {
  return Object.entries(trends).map(([month, value]) => ({
    month,
    value,
  }));
};

const COLORS = ["#0ea5e9", "#94a3b8", "#f97316"];

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-32 bg-muted rounded-lg"></div>
        ))}
        {[...Array(3)].map((_, index) => (
          <div 
            key={index + 4} 
            className={`h-80 bg-muted rounded-lg ${index === 0 ? "md:col-span-2" : ""}`}
          ></div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const totalFeeAmount = data.feeCollectionStatus.paid * 15000;
  const pendingFeeAmount = (data.feeCollectionStatus.pending + data.feeCollectionStatus.overdue) * 15000;
  const collectionRate = (data.feeCollectionStatus.paid / 
    (data.feeCollectionStatus.paid + data.feeCollectionStatus.pending + data.feeCollectionStatus.overdue)) * 100;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage hostel operations, fee collections, and analytics.
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button asChild variant="default">
            <Link to="/dashboard/reports">
              <PieChart className="mr-2 h-4 w-4" />
              Generate Reports
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={data.totalStudents}
          description="Currently enrolled"
          icon={<UsersRound className="h-4 w-4" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Available Rooms"
          value={data.availableRooms}
          description="Ready for allocation"
          icon={<Building className="h-4 w-4" />}
        />
        <StatsCard
          title="Fee Collection"
          value={`₹${totalFeeAmount.toLocaleString()}`}
          description={`${collectionRate.toFixed(1)}% collection rate`}
          icon={<CreditCard className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${pendingFeeAmount.toLocaleString()}`}
          description={`${data.feeCollectionStatus.pending + data.feeCollectionStatus.overdue} students pending`}
          icon={<CreditCard className="h-4 w-4" />}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <DashboardCard
          title="Fee Collection Trends"
          description="Monthly fee collection data"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formatTrends(data.feePaymentTrends)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Amount"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Fee Collection"
                  stroke="#0ea5e9"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          <DashboardCard
            title="Room Allocation"
            description="Current occupancy status"
          >
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={MOCK_ROOM_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {MOCK_ROOM_ALLOCATION.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} rooms`, ""]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Fee Status"
            description="Student payment status"
          >
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={MOCK_FEE_STATUS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {MOCK_FEE_STATUS.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} students`, ""]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        <DashboardCard
          title="Student Activity Trends"
          description="Monthly outing and complaint trends"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.keys(data.outingTrends).map((month) => ({
                  month,
                  outings: data.outingTrends[month],
                  complaints: data.complaintTrends[month],
                }))}
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
          title="Recent Fee Payments"
          description="Latest student payments"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RECENT_PAYMENTS.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.student}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button variant="link" size="sm" className="px-0" asChild>
              <Link to="/dashboard/fee-collection" className="flex items-center">
                View all payments
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full justify-start" asChild>
              <Link to="/dashboard/users">
                <UsersRound className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/dashboard/rooms">
                <Building className="mr-2 h-4 w-4" />
                Room Allocation
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/dashboard/fee-collection">
                <CreditCard className="mr-2 h-4 w-4" />
                Fee Collection
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/dashboard/notices">
                Post Hostel Notice
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="col-span-2 p-4">
          <h3 className="font-semibold text-lg mb-2">Upcoming Fee Deadlines</h3>
          <p className="text-muted-foreground text-sm mb-4">
            70 students have fees due in the next 15 days
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
              <div>
                <p className="font-medium">Mess Fee</p>
                <p className="text-sm text-muted-foreground">Due June 15, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium">50 Students</p>
                <p className="text-sm text-muted-foreground">₹750,000</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
              <div>
                <p className="font-medium">Hostel Fee</p>
                <p className="text-sm text-muted-foreground">Due June 20, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium">20 Students</p>
                <p className="text-sm text-muted-foreground">₹300,000</p>
              </div>
            </div>
            <Button className="w-full mt-2" variant="outline" asChild>
              <Link to="/dashboard/fee-collection">Send Reminders</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
