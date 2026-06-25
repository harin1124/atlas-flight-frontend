import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
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
 *
 * 표시용 신원(이름·회원번호·아이디)은 localStorage 에 persist 해, 새로고침해도 화면이
 * 로그인 상태를 유지하도록 한다. 토큰은 저장하지 않으므로 쿠키의 XSS 안전성은 그대로다.
 * 다만 쿠키가 만료돼도 저장된 신원은 남아 "로그인됨"으로 보일 수 있다(stale) — 이는 추후
 * 401 응답 인터셉터에서 clearAuth 로 정리해야 한다. 인증의 소스 오브 트루스는 여전히 쿠키다.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'atlas-auth-store',
      storage: createJSONStorage(() => localStorage),
      // 표시용 신원만 저장한다(토큰·함수 제외).
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
