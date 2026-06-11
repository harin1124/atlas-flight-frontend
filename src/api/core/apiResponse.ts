import { RESULT_CODE } from '@/api/core/resultCodes';

/** 모든 백엔드 응답을 감싸는 공통 envelope (org.atlas.flight.core.ApiResponse). */
export interface ApiResponse<T> {
  resultCode: string;
  resultMessage: string;
  resultDetailMessage: string;
  data: T | null;
}

/**
 * resultCode가 성공(ATF200)이 아닐 때 던지는 에러.
 *
 * 로그인 실패 등 논리적 실패도 HTTP 200으로 오므로 axios가 throw하지 않는다.
 * 그래서 unwrapApiResponse에서 직접 판별해 이 에러를 던진다. resultCode를 들고 있어,
 * 호출부에서 코드별 분기(예: PASSWORD_MISMATCH 시 비밀번호 필드 강조)가 가능하다.
 */
export class ApiError extends Error {
  readonly resultCode: string;
  readonly resultDetailMessage: string;

  constructor(response: ApiResponse<unknown>) {
    super(response.resultMessage || '요청 처리 중 오류가 발생했습니다.');
    this.name = 'ApiError';
    this.resultCode = response.resultCode;
    this.resultDetailMessage = response.resultDetailMessage;
  }
}

/** envelope를 풀어 성공 시 data를 반환하고, 실패(비 ATF200) 시 ApiError를 던진다. */
export const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.resultCode !== RESULT_CODE.SUCCESS) {
    throw new ApiError(response);
  }

  return response.data as T;
};
