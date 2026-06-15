import axios from 'axios';
import { ApiError } from '@/api/core/apiResponse';

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
  // envelope에서 직접 던진 에러 (논리적 실패가 HTTP 200으로 오는 경우)
  if (error instanceof ApiError) {
    return error.message || fallback;
  }

  // 실제 HTTP 에러: 응답 바디가 envelope면 resultMessage를 우선 사용
  if (axios.isAxiosError<{ resultMessage?: string; message?: string }>(error)) {
    return error.response?.data?.resultMessage ?? error.response?.data?.message ?? error.message ?? fallback;
  }

  return fallback;
};
