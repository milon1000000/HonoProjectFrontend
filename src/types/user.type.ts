export type UserRole = "ADMIN" | "LANDLORD" | "TENANT";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  imageUrl?: string;
  imagePublicId?: string;
  authProvider?: "GOOGLE" | "CREDENTIAL";
  emailVerified?: boolean;
  needPasswordChange?: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    userId: string;
    isDeleted: boolean;
  } | null;
  landlord?: {
    id: string;
    userId: string;
    address: string;
    nidOrPassportNumber: string;
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
    isDeleted: boolean;
  } | null;
}

export interface IUsersQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  SortOrder?: "asc" | "desc";
  isDeleted?: boolean;
}

export interface IUsersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IUsersApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IUser[];
  meta?: IUsersMeta;
}
