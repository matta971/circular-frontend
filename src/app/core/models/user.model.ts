export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  walletBalance?: number;
  emailVerified?: boolean;
  addresses?: Address[];
  createdAt?: string;
}

export enum UserRole {
  CLIENT = 'CLIENT',
  DRIVER = 'DRIVER',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER'
}

export interface Address {
  id?: number;
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  country: string;
  additionalInfo?: string;
  isDefault?: boolean;
  label?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface WalletResponse {
  userId: number;
  balance: number;
  currency: string;
}
