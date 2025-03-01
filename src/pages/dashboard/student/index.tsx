
import { useEffect, useState } from "react";
import { 
  FileWarning, 
  Clock, 
  CreditCard, 
  Building, 
  ArrowUpRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardCard from "@/components/dashboard/dashboard-card";
import StatsCard from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  OutingRequest, 
  ComplaintStatus, 
  RoomDetails, 
  FeePayment,
  StudentDashboardData 
} from "@/lib/types";

// Mock data for demonstration
const MOCK_DATA: StudentDashboardData = {
  outingRequests: [
    {
      id: "1",
      status: "pending",
      dateFrom: "2023-05-15T08:00:00Z",
      dateTo: "2023-05-15T20:00:00Z",
      reason: "Family visit",
      createdAt: "2023-05-10T10:30:00Z",
    },
    {
      id: "2",
      status: "approved",
      dateFrom: "2023-05-10T09:00:00Z",
      dateTo: "2023-05-10T18:00:00Z",
      reason: "Medical appointment",
      createdAt: "2023-05-05T14:20:00Z",
    },
  ],
  complaints: [
    {
      id: "1",
      status: "pending",
      title: "Wi-Fi connectivity issue",
      description: "Unable to connect to Wi-Fi in Room 203",
      createdAt: "2023-05-08T09:15:00Z",
      updatedAt: "2023-05-08T09:15:00Z",
    },
    {
      id: "2",
      status: "in-progress",
      title: "Water leakage in bathroom",
      description: "There is water leakage from the shower in Room 203",
      createdAt: "2023-05-05T11:30:00Z",
      updatedAt: "2023-05-06T10:45:00Z",
    },
    {
      id: "3",
      status: "resolved",
      title: "Broken chair",
      description: "The chair in Room 203 is broken",
      createdAt: "2023-04-28T16:20:00Z",
      updatedAt: "2023-04-30T14:10:00Z",
    },
  ],
  roomDetails: {
    roomNumber: "203",
    floor: 2,
    building: "Block A",
    capacity: 2,
    occupancy: 2,
  },
  feePayments: [
    {
      id: "1",
      amount: 15000,
      dueDate: "2023-06-15T00:00:00Z",
      status: "pending",
    },
    {
      id: "2",
      amount: 15000,
      dueDate: "2023-03-15T00:00:00Z",
      status: "paid",
      paidDate: "2023-03-10T11:45:00Z",
    },
  ],
};

const StudentDashboard = () => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
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
        {[...Array(2)].map((_, index) => (
          <div key={index + 4} className="h-80 bg-muted rounded-lg md:col-span-2"></div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const pendingComplaints = data.complaints.filter(
    (complaint) => complaint.status !== "resolved"
  ).length;
  
  const pendingOutings = data.outingRequests.filter(
    (request) => request.status === "pending"
  ).length;
  
  const pendingFees = data.feePayments.filter(
    (payment) => payment.status === "pending"
  ).reduce((sum, payment) => sum + payment.amount, 0);

  const roomOccupancyPercentage = 
    (data.roomDetails.occupancy / data.roomDetails.capacity) * 100;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your hostel status.
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button asChild variant="default">
            <Link to="/dashboard/outings">
              <Clock className="mr-2 h-4 w-4" />
              Request Outing
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard/complaints">
              <FileWarning className="mr-2 h-4 w-4" />
              Report Issue
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Complaints"
          value={pendingComplaints}
          description="Active complaints"
          icon={<FileWarning className="h-4 w-4" />}
        />
        <StatsCard
          title="Outing Requests"
          value={pendingOutings}
          description="Awaiting approval"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${pendingFees.toLocaleString()}`}
          description="Due by June 15, 2023"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Room Occupancy"
          value={`${data.roomDetails.occupancy}/${data.roomDetails.capacity}`}
          description={`Room ${data.roomDetails.roomNumber}, ${data.roomDetails.building}`}
          icon={<Building className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <DashboardCard
          title="Recent Complaints"
          description="Status of your recent complaints"
        >
          <div className="space-y-4">
            {data.complaints.slice(0, 3).map((complaint) => (
              <div key={complaint.id} className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{complaint.title}</h4>
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
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {complaint.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="link" size="sm" className="px-0" asChild>
              <Link to="/dashboard/complaints" className="flex items-center">
                View all complaints
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Outing Requests"
          description="Status of your recent outing requests"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.outingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {new Date(request.dateFrom).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "default"
                          : request.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        request.status === "approved"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/20 dark:text-green-300"
                          : request.status === "rejected"
                          ? "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-800/20 dark:text-red-300"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800/20 dark:text-gray-300"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button variant="link" size="sm" className="px-0" asChild>
              <Link to="/dashboard/outings" className="flex items-center">
                View all requests
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Room Details"
          description={`Room ${data.roomDetails.roomNumber}, ${data.roomDetails.building}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Room Number</p>
                <p className="text-lg">{data.roomDetails.roomNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Building</p>
                <p className="text-lg">{data.roomDetails.building}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Floor</p>
                <p className="text-lg">{data.roomDetails.floor}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Occupancy</p>
                <p className="text-lg">
                  {data.roomDetails.occupancy}/{data.roomDetails.capacity}
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Occupancy</p>
                <p className="text-sm font-medium">{roomOccupancyPercentage}%</p>
              </div>
              <Progress value={roomOccupancyPercentage} className="h-2" />
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/room">Room Details</Link>
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Fee Payments"
          description="Status of your fee payments"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.feePayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "paid"
                          ? "default"
                          : payment.status === "overdue"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        payment.status === "paid"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/20 dark:text-green-300"
                          : payment.status === "overdue"
                          ? "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-800/20 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-800/20 dark:text-yellow-300"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center">
            <Button variant="link" size="sm" className="px-0" asChild>
              <Link to="/dashboard/fees" className="flex items-center">
                View payment history
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            {pendingFees > 0 && (
              <Button variant="default" size="sm" asChild>
                <Link to="/dashboard/fees">Pay Now</Link>
              </Button>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default StudentDashboard;
