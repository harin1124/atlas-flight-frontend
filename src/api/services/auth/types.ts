export interface LoginRequest {
  customerId: string;
  password: string;
}

export interface LoginResponse {
  customerId: string;
  customerNumber: string;
  korFirstName: string;
  korLastName: string;
  engFirstName: string;
  engLastName: string;
  accessToken: string;
}
