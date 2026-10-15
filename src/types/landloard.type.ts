export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  rentPrice: number;
  totalRooms: number;
  amenities: string[];
  imageUrl: string[];
  isAvailable: boolean;
}

export interface Landlord {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  nidOrPassportNumber: string;
  verificationStatus: "APPROVED" | "PENDING" | "REJECTED";
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  user?: {
    imageUrl?: string;
    role?: string;
    status?: string;
  } | null;
  properties?: Property[];
}

export interface LandlordResponse {
  success: boolean;
  message: string;
  data: Landlord[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}




