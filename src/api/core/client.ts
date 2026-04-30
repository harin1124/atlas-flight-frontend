import axios from 'axios';

const DEFAULT_TIMEOUT_MS = 10000;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const createApiClient = (baseURL: string) =>
  axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT_MS,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const rootApiClient = createApiClient(API_BASE_URL);

export const getApiErrorMessage = (error: unknown, fallback = '요청 처리 중 오류가 발생했습니다.') => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  return fallback;
};
