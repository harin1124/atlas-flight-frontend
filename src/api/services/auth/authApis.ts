import { authApiClient } from '@/api/core/clients';
import { unwrapApiResponse, type ApiResponse } from '@/api/core/apiResponse';
import type { LoginRequest, LoginResponse } from '@/api/services/auth/types';

export const login = async (payload: LoginRequest) => {
  const { data } = await authApiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload);
  return unwrapApiResponse(data);
};
