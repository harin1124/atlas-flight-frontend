import { Alert, type AlertColor, Box, IconButton, Slide, type SlideProps, Snackbar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { SvgIconComponent } from '@mui/icons-material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { atlasColors } from '@/theme/colors';
import { useToastStore } from '@/stores/toastStore';

const AUTO_HIDE_MS = 3000;

// 토스트 전체 크기를 약 5% 확대. 기하 치수(폭·패딩·아이콘 배지·모서리)에만 곱하고,
// 메시지 폰트 크기(.MuiAlert-message fontSize)는 의도적으로 그대로 둔다.
const TOAST_SCALE = 1.05;

/** 심각도별 강조 색 + 둥근 아이콘. */
const TOAST_ACCENT: Record<AlertColor, { color: string; Icon: SvgIconComponent }> = {
  success: { color: atlasColors.semantic.success, Icon: CheckCircleRoundedIcon },
  error: { color: atlasColors.semantic.error, Icon: ErrorRoundedIcon },
  warning: { color: atlasColors.semantic.warning, Icon: WarningRoundedIcon },
  info: { color: atlasColors.semantic.info, Icon: InfoRoundedIcon },
};

/** 위에서 부드럽게 내려오는 슬라이드 전환. */
const SlideDown = (props: SlideProps) => <Slide {...props} direction="down" />;

/**
 * 앱 전역 토스트. App에서 라우터 바깥에 한 번만 마운트하므로 라우트 이동에도 유지된다.
 * 표시할 내용은 useToastStore가 들고 있다.
 */
const GlobalToast = () => {
  const open = useToastStore((state) => state.open);
  const message = useToastStore((state) => state.message);
  const severity = useToastStore((state) => state.severity);
  const hideToast = useToastStore((state) => state.hideToast);

  const { color, Icon } = TOAST_ACCENT[severity];

  return (
    <Snackbar
      open={open}
      autoHideDuration={AUTO_HIDE_MS}
      onClose={() => hideToast()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={SlideDown}
      sx={{ top: { xs: 16, sm: 24 } }}
    >
      <Alert
        severity={severity}
        icon={
          // 색이 입혀진 원형 아이콘 배지
          <Box
            sx={{
              width: 30 * TOAST_SCALE,
              height: 30 * TOAST_SCALE,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(color, 0.14),
              color,
            }}
          >
            <Icon sx={{ fontSize: 19 * TOAST_SCALE }} />
          </Box>
        }
        action={
          <IconButton
            aria-label="닫기"
            size="small"
            onClick={hideToast}
            sx={{ color: atlasColors.text.subtle, '&:hover': { color: atlasColors.text.muted } }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 * TOAST_SCALE }} />
          </IconButton>
        }
        sx={{
          minWidth: { xs: 'auto', sm: 340 * TOAST_SCALE },
          maxWidth: `min(${440 * TOAST_SCALE}px, calc(100vw - 32px))`,
          alignItems: 'center',
          py: 1.25 * TOAST_SCALE,
          pl: 1.5 * TOAST_SCALE,
          pr: 1 * TOAST_SCALE,
          borderRadius: 3 * TOAST_SCALE,
          bgcolor: atlasColors.background.elevated,
          color: atlasColors.text.strong,
          border: `1px solid ${atlasColors.border.subtle}`,
          boxShadow: '0 12px 32px rgb(7 24 39 / 14%)',
          '& .MuiAlert-icon': {
            p: 0,
            mr: 1.25 * TOAST_SCALE,
            opacity: 1,
            alignItems: 'center',
          },
          '& .MuiAlert-message': {
            p: 0,
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.4,
          },
          '& .MuiAlert-action': {
            p: 0,
            mr: 0,
            ml: 'auto',
            alignItems: 'center',
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalToast;
