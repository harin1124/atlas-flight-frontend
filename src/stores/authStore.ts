import { create } from 'zustand';
import type { LoginResponse } from '@/api/services/auth/types';

/** 스토어에 들고 다니는 기본 사용자 정보. (이름은 로그인 응답의 조각을 합친 표시용 값) */
export interface AuthUser {
  /** 회원 아이디 (로그인 ID) */
  customerId: string;
  /** 회원 번호 (12자리 업무번호) */
  customerNumber: string;
  /** 한글명 — 성+이름을 합친 표시용 값 */
  userKorName: string;
  /** 영문명 — 이름+성을 합친 표시용 값 */
  userEngName: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** 로그인 성공 응답으로 인증 상태를 채운다. 표시용 이름은 여기서 합쳐 담는다. (액세스 토큰은 담지 않는다) */
  setAuth: (res: LoginResponse) => void;
  /** 로그아웃 등으로 인증 상태를 비운다. */
  clearAuth: () => void;
}

/**
 * 로그인한 사용자 정보를 앱 전역에서 들고 다니는 스토어.
 *
 * 액세스 토큰은 백엔드가 심는 HttpOnly 쿠키로 자동 전송되므로 스토어에 담지 않는다
 * (JS에서 접근 가능한 곳에 토큰을 두면 XSS 노출이라 쿠키의 이점이 약해진다).
 * 화면에서 "누가 로그인했는지"를 알기 위한 클라이언트 상태이며, 인메모리라 새로고침 시
 * 초기화된다 — 인증 자체는 쿠키가 소스 오브 트루스다.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (res) =>
    // 백엔드는 이름 조각(성/이름)을 주고, 표시용 한글명·영문명은 여기서 합쳐 담는다.
    set({
      user: {
        customerId: res.customerId,
        customerNumber: res.customerNumber,
        userKorName: `${res.korLastName ?? ''}${res.korFirstName ?? ''}` || '회원',
        userEngName: `${res.engFirstName ?? ''} ${res.engLastName ?? ''}`.trim(),
      },
      isAuthenticated: true,
    }),
  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
