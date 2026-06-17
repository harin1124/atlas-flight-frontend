import axios from 'axios';
import { ApiError } from '@/api/core/apiResponse';
import { useAuthStore } from '@/stores/authStore';

const DEFAULT_TIMEOUT_MS = 10000;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const createApiClient = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT_MS,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 세션 만료/무효(쿠키 JWT 검증 실패)는 게이트웨이가 HTTP 401로 내려준다.
  // (업무 실패는 HTTP 200 + resultCode 봉투라 여기 걸리지 않는다.)
  // 인증 상태를 비우고(localStorage 포함) 메인 페이지로 돌려보낸다.
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
        if (window.location.pathname !== '/') {
          // replace: 인증 만료된 페이지로 뒤로가기 되돌아가지 않도록 히스토리 교체
          window.location.replace('/');
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

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
