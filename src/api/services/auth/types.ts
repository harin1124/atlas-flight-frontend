export interface LoginRequest {
  customerId: string;
  password: string;
}

export interface LoginResponse {
  customerId: string;
  userName: string;
  accessToken: string;
}
