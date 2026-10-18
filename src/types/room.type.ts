import { Property } from "./property.type";

export interface CreateRoomInput {
  roomNumber: string;
  rentAmount: number;
  availableSeats?: number;
  capacity?: number;
  propertyId: string;
}

export interface UpdateRoomInput {
  roomNumber?: string;
  rentAmount?: number;
  availableSeats?: number;
  capacity?: number;
  status?: "AVAILABLE" | "BOOKED" | string;
}

export interface Room {
  id: string;
  roomNumber: string;
  rentAmount: number;
  availableSeats?: number;
  capacity?: number;
  status?: "AVAILABLE" | "BOOKED" | string;
  propertyId?: string;
  property?: Property;
  createdAt?: string;
  updatedAt?: string;
}

export interface SingleRoomResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Room;
}

export interface PropertyRoomResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
}

export interface GetAllRoomsParams {
  searchTerm?: string;
  city?: string;
  status?: string;
  propertyId?: string;
  minRentAmount?: number | string;
  maxRentAmount?: number | string;
  capacity?: number | string;
  availableSeats?: number | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}