// Note: userType est 'string' (de SQLite) et non UserType enum
// Les valeurs possibles: 'USER' | 'CANDIDATE' | 'ADMIN' | 'MODERATOR'

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  userType: string; // SQLite retourne string
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
    userType: string; // SQLite retourne string
  };
  tokens: JwtTokens;
  requires2FA?: boolean;
}
