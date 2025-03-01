import type { User as PrismaUser } from "@prisma/client";

export interface JwtPayload {
  id: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: UserWithRoles;
  token: string;
}

export interface ApiErrorResponse {
  error: string;
  status: number;
}

export interface UserWithRoles extends Omit<PrismaUser, "password"> {
  roles: string[];
}

export type UserRole =
  | "admin"
  | "customer"
  | "restaurant_owner"
  | "restaurant_staff"
  | "driver";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
  role: UserRole;
}

// Additional types to ensure consistency across the application
export interface SignupResponse {
  success: boolean;
  message?: string;
}
