import { UserType } from '@prisma/client';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  userType: UserType;
  iat?: number;
  exp?: number;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    userType: UserType;
  };
  tokens: JwtTokens;
  requires2FA?: boolean;
}
