import { create } from 'zustand';

/** 스토어에 들고 다니는 기본 사용자 정보. */
export interface AuthUser {
  customerId: string;
  userName: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** 로그인 성공 시 사용자 정보로 인증 상태를 채운다. (액세스 토큰은 담지 않는다) */
  setAuth: (user: AuthUser) => void;
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
  setAuth: (user) =>
    // 토큰 등 불필요한 필드가 끼지 않도록 사용자 식별 정보만 명시적으로 추려 담는다.
    set({
      user: { customerId: user.customerId, userName: user.userName },
      isAuthenticated: true,
    }),
  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
