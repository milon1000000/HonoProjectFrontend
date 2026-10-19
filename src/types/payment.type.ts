import { BookingStatus, PaymentStatus } from "./booking.type";
import { Property } from "./property.type";
import { Room } from "./room.type";

export interface PaymentTenant {
  id: string;
  name: string;
  email: string;
  userId: string;
  contactNumber?: string | null;
}

export interface PaymentBooking {
  id: string;
  status: BookingStatus;
  startDate: string;
  totalAmount: number;
  seatCount: number;
  tenantId: string;
  propertyId: string;
  roomId?: string | null;
  tenant?: PaymentTenant;
  property?: Property;
  room?: Room;
}

export interface PaymentRecord {
  id: string;
  transactionId?: string | null;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  gateway?: string;
  paymentGatewayData?: any;
  createdAt: string;
  updatedAt: string;
  booking?: PaymentBooking;
}

export interface AllPaymentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: PaymentRecord[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

