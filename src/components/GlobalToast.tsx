import { Alert, Snackbar } from '@mui/material';
import { useToastStore } from '@/stores/toastStore';

const AUTO_HIDE_MS = 3000;

/**
 * 앱 전역 토스트. App에서 라우터 바깥에 한 번만 마운트하므로 라우트 이동에도 유지된다.
 * 표시할 내용은 useToastStore가 들고 있다.
 */
const GlobalToast = () => {
  const open = useToastStore((state) => state.open);
  const message = useToastStore((state) => state.message);
  const severity = useToastStore((state) => state.severity);
  const hideToast = useToastStore((state) => state.hideToast);

  return (
    <Snackbar
      open={open}
      autoHideDuration={AUTO_HIDE_MS}
      onClose={() => hideToast()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={hideToast} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalToast;
