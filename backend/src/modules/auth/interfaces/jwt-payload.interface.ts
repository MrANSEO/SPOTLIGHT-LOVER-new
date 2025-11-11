export interface JwtPayload {
  sub: string; // Admin ID
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  tokens: JwtTokens;
  requires2FA?: boolean;
}
