import '@/pages/layout/style/headerUtilLayout.scss';
import type { CSSProperties } from 'react';
import { Button, Container, IconButton, ListItem } from '@mui/material';
import List from '@mui/material/List';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { atlasColors } from '@/theme/colors';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/api/services/auth/authApis';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';

const utilStyle = {
  '--header-util-bg': atlasColors.background.subtle,
  '--header-util-border': atlasColors.border.subtle,
  '--header-util-text': atlasColors.text.muted,
  '--header-util-text-strong': atlasColors.text.strong,
} as CSSProperties;

/**
 * 헤더 유틸 레이아웃
 *
 * <p>
 * 헤더 내 유틸성 UI를 보여주는 레이아웃입니다.
 * ex) 이벤트, 회원가입
 * </p>
 *
 */
const HeaderUtilLayout = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const showToast = useToastStore((state) => state.showToast);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 서버 로그아웃이 실패해도 아래 finally에서 클라이언트 상태를 비운다
    } finally {
      clearAuth();
      showToast('로그아웃되었습니다.');
      navigate('/');
    }
  };

  return (
    <Container
      className={'header-util-layout'}
      maxWidth={false}
      component="header"
      style={utilStyle}
    >
      <div className="header-util-layout__inner">
        <List aria-label="유틸리티 메뉴">
          <ListItem>
            <Button variant="text" color="inherit" startIcon={<HelpOutlineIcon />}>
              고객지원
            </Button>
          </ListItem>
          <ListItem className="header-util-layout__icon">
            <IconButton aria-label="검색" size="small">
              <SearchIcon fontSize="small" />
            </IconButton>
          </ListItem>
          <ListItem>
            <Button
              className="header-util-layout__login"
              variant="text"
              color="inherit"
              startIcon={<PersonOutlineIcon />}
              onClick={isAuthenticated ? handleLogout : () => navigate('/login')}
            >
              {isAuthenticated ? '로그아웃' : '로그인'}
            </Button>
          </ListItem>
        </List>
      </div>
    </Container>
  );
};
export default HeaderUtilLayout;
