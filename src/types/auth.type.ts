export interface LoginPayload {
  email: string;
  password: string;
}

export interface ITenantRegistrationPayload {
  name: string;
  email: string;
  password: string;
  tenant: {
    contactNumber: string;
    address?: string;
  };
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}


export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  googleId: string | null;
  authProvider: string;
  emailVerified: boolean;
  role: string;
  status: string;
  needPasswordChange: boolean;
  imageUrl?: string;
  imagePublicId?: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id?: string;
    name?: string;
    email?: string;
    contactNumber?: string | null;
    address?: string | null;
  } | null;
  landlord?: {
    id?: string;
    name?: string;
    email?: string;
    contactNumber?: string | null;
    address?: string | null;
  } | null;
}

export interface RegisterFormValues{
  name: string;
  email: string;
  password: string;
  tenant: {
    contactNumber: string;
    address?: string;
  };
};

export interface ForgotPassword  {
  email: string;
};

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  otp: string;
}

export interface UserInfo {
  name: string;
  email: string;
  contactNumber: string;
}

export interface LandlordInfo {
  address: string;
  nidOrPassportNumber: string;
}

export interface LandlordRegistrationPayload {
  user: UserInfo;
  landlord: LandlordInfo;
}