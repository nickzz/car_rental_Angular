// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

// User models
export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  dob: Date;
  icNumber: string;
  email: string;
  address: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nric: string;
  email: string;
  address: string;
  phoneNumber: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  role: string;
  userId: number;
  email: string;
}

// Car models
export interface Car {
  id: number;
  brand: string;
  model: string;
  type: string;
  plateNo: string;
  colour: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarAvailability {
  startDate: Date;
  endDate: Date;
}

export interface PriceEstimate {
  carId: number;
  startDate: Date;
  endDate: Date;
  estimatedPrice: number;
  currency: string;
}

// Booking models
// export enum BookingStatus {
//   Pending = 'Pending',
//   Approved = 'Approved',
//   Rejected = 'Rejected'
// }
export enum BookingStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

export interface Booking {
  id: number;
  userId: number;
  user?: User;
  carId: number;
  car?: Car;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  messageToCustomer?: string;
  notes?: string;
  estimatedPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingDto {
  carId: number;
  startDate: Date;
  endDate: Date;
  notes?: string;
}

export interface MessageDto {
  message: string;
}