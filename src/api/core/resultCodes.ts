/**
 * 백엔드 ApiResponse.resultCode 값 상수.
 *
 * 성공은 ATF200, 실패는 모듈별 코드로 내려온다. 논리적 실패(예: 비밀번호 불일치)도
 * HTTP 200으로 오기 때문에, 프론트는 HTTP 상태가 아니라 이 resultCode로 성공/실패를 판별한다.
 *
 * - 공통:   org.atlas.flight.core.message.ResponseCodeGeneral
 * - 로그인: org.atlas.flight.auth.domain.auth.message.AuthLoginErrorCode
 */
export const RESULT_CODE = {
  // 공통 (ResponseCodeGeneral)
  SUCCESS: 'ATF200',
  BAD_REQUEST: 'ATF400',
  UNAUTHORIZED: 'ATF401',
  FORBIDDEN: 'ATF403',
  NOT_FOUND: 'ATF404',
  TOO_MANY_REQUESTS: 'ATF429',
  UNKNOWN: 'ATF500',

  // 로그인 (AuthLoginErrorCode)
  CUSTOMER_ID_NOT_FOUND: 'LGN404',
  PASSWORD_MISMATCH: 'LGN401',
  LOGIN_FAILED: 'LGN500',
} as const;

export type ResultCode = (typeof RESULT_CODE)[keyof typeof RESULT_CODE];
