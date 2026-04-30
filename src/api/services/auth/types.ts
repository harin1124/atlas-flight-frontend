export type LoginType = 'ID' | 'SKYPASS';

export interface LoginRequest {
  loginType: LoginType;
  identifier: string;
  password: string;
  rememberId: boolean;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  userId: string;
}
