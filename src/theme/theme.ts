import { createTheme } from '@mui/material/styles';
import { atlasColors } from '@/theme/colors';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: atlasColors.action.primary,
      dark: atlasColors.action.primaryPressed,
      contrastText: atlasColors.action.primaryText,
    },
    secondary: {
      main: atlasColors.action.secondary,
      contrastText: atlasColors.action.secondaryText,
    },
    success: {
      main: atlasColors.semantic.success,
    },
    warning: {
      main: atlasColors.semantic.warning,
    },
    error: {
      main: atlasColors.semantic.error,
    },
    info: {
      main: atlasColors.semantic.info,
    },
    background: {
      default: atlasColors.background.default,
      paper: atlasColors.background.elevated,
    },
    text: {
      primary: atlasColors.text.default,
      secondary: atlasColors.text.muted,
      disabled: atlasColors.text.subtle,
    },
    divider: atlasColors.border.default,
  },
});
