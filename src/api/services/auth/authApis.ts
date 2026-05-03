import { authApiClient } from '@/api/core/clients';
import type { LoginRequest, LoginResponse } from '@/api/services/auth/types';

export const login = async (payload: LoginRequest) => {
  const { data } = await authApiClient.post<LoginResponse>('/auth/login', payload);
  return data;
};
