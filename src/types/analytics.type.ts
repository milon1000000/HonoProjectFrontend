export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface TenantAnalyticsData {
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  cancelledBookings: number;
  rejectedBookings: number;
  totalAmountSpent: number;
  totalRefunded: number;
  totalAppointments?: number;
  upcomingAppointments?: number;
  completedAppointments?: number;
  cancelledAppointments?: number;
}

export interface LandlordAnalyticsData {
  totalProperties: number;
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  cancelledBookings: number;
  rejectedBookings: number;
  totalLandlordEarnings: number;
  totalLandlordRefunded: number;
  totalSchedule?: number;
  publishedSchedule?: number;
  totalAppointments?: number;
  upcomingAppointments?: number;
  ongoingAppointments?: number;
  completedAppointments?: number;
  cancelledAppointments?: number;
  totalDoctorEarnings?: number;
  totalDoctorRefunded?: number;
}

export interface AdminAnalyticsData {
  totalLandlords: number;
  totalPendingLandlordApplication: number;
  totalApprovedLandlords: number;
  totalRejectedLandlords: number;
  totalTenants: number;
  totalProperties: number;
  totalRooms: number;
  totalBookings: number;
  totalPendingBookings: number;
  totalApprovedBookings: number;
  totalCancelledBookings: number;
  totalRejectedBookings: number;
  totalRevenue: number;
  totalRefunded: number;
  totalDoctors?: number;
  totalPendingDoctorApplication?: number;
  totalApprovedDoctors?: number;
  totalRejectedDoctors?: number;
  totalPatients?: number;
  totalAppointments?: number;
  totalCompletedAppointments?: number;
  totalCancelledAppointments?: number;
  totalReveneu?: number;
}

