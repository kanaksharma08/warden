
export type UserRole = "student" | "warden" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ComplaintStatus {
  id: string;
  status: "pending" | "in-progress" | "resolved";
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutingRequest {
  id: string;
  status: "pending" | "approved" | "rejected";
  dateFrom: string;
  dateTo: string;
  reason: string;
  createdAt: string;
}

export interface RoomDetails {
  roomNumber: string;
  floor: number;
  building: string;
  capacity: number;
  occupancy: number;
}

export interface FeePayment {
  id: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
}

export interface StudentDashboardData {
  outingRequests: OutingRequest[];
  complaints: ComplaintStatus[];
  roomDetails: RoomDetails;
  feePayments: FeePayment[];
}

export interface WardenDashboardData {
  pendingOutingRequests: number;
  unresolvedComplaints: number;
  activeStudents: number;
  outingTrends: Record<string, number>;
  complaintTrends: Record<string, number>;
}

export interface AdminDashboardData {
  totalStudents: number;
  availableRooms: number;
  feeCollectionStatus: {
    paid: number;
    pending: number;
    overdue: number;
  };
  complaintTrends: Record<string, number>;
  outingTrends: Record<string, number>;
  feePaymentTrends: Record<string, number>;
}
