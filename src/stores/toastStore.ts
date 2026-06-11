import { create } from 'zustand';
import type { AlertColor } from '@mui/material';

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
  /** 토스트를 띄운다. severity 기본값은 success. */
  showToast: (message: string, severity?: AlertColor) => void;
  /** 토스트를 닫는다. */
  hideToast: () => void;
}

/**
 * 전역 토스트(스낵바) 상태.
 *
 * 라우트 이동 후에도 보여야 하므로, 라우터 바깥에 마운트된 <GlobalToast />가 이 스토어를
 * 구독해 렌더한다. 덕분에 토스트를 띄운 페이지가 언마운트(예: 로그인 → 메인 이동)돼도
 * 토스트는 유지된다.
 */
export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: '',
  severity: 'success',
  showToast: (message, severity = 'success') => set({ open: true, message, severity }),
  hideToast: () => set({ open: false }),
}));
