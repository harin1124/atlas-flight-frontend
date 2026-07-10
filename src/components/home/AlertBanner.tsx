import '@/components/home/style/alertBanner.scss';
import type { CSSProperties } from 'react';
import { Container } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { atlasColors } from '@/theme/colors';

const alertStyle = {
  '--alert-banner-bg': 'rgba(229, 72, 77, 0.08)',
  '--alert-banner-border': 'rgba(229, 72, 77, 0.24)',
  '--alert-banner-text': atlasColors.semantic.error,
} as CSSProperties;

const AlertBanner = () => {
  return (
    <Container className="alert-banner" maxWidth={false} style={alertStyle}>
      <div className="alert-banner__inner">
        <WarningAmberIcon fontSize="small" />
        <span>태풍 영향으로 일부 노선 비정상 운항이 예상됩니다 (제주, 오키나와, 나하)</span>
      </div>
    </Container>
  );
};

export default AlertBanner;
