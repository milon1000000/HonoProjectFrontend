export interface PropertyLandlordUser {
  id?: string;
  name?: string;
  email?: string;
  imageUrl?: string;
  role?: string;
}

export interface PropertyLandlord {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  address?: string;
  nidOrPassportNumber?: string;
  verificationStatus?: string;
  user?: PropertyLandlordUser;
}

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
  imagePublicId: string[];
  isAvailable: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  landlordId: string;
  landlord?: PropertyLandlord;
  rooms?: any[];
}

export interface PropertiesMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AllPropertiesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Property[];
    meta: PropertiesMeta;
  };
}

export interface PropertyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Property;
}