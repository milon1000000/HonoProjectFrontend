import { Property } from "./property.type";
import { Room } from "./room.type";

export interface IBookingPayload {
  propertyId: string;
  roomId?: string;
  startDate: string | Date;
  seatCount?: number;
}

export interface IPayBookingPayload {
  bookingId: string;
}

export interface ICancelBookingPayload {
  bookingId: string;
}

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  transactionId?: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  gateway?: string;
  paymentGatewayData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface BookingTenant {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  userId?: string;
}

export interface Booking {
  id: string;
  status: BookingStatus;
  startDate: string;
  totalAmount: number;
  seatCount: number;
  tenantId: string;
  propertyId: string;
  roomId?: string;
  tenant?: BookingTenant;
  property?: Property;
  room?: Room;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface MyBookingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Booking[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AllBookingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Booking[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}