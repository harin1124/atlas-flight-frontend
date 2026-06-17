import '@/pages/layout/style/headerMainLayout.scss';
import { useState, type CSSProperties, type MouseEvent } from 'react';
import { Button, Container, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { atlasColors } from '@/theme/colors';
import { useAuthStore } from '@/stores/authStore';
import MyPagePanel from '@/pages/layout/MyPagePanel';

const navigationItems = ['예약', '공항', '기내', 'ATLAS CLUB', '서비스 안내'];

const mainStyle = {
  '--header-main-bg': atlasColors.background.elevated,
  '--header-main-border': atlasColors.border.default,
  '--header-main-brand': atlasColors.brand.navy,
  '--header-main-brand-soft': atlasColors.background.brandSubtle,
  '--header-main-accent': atlasColors.action.primary,
  '--header-main-text': atlasColors.text.default,
  '--header-main-muted': atlasColors.text.muted,
  '--header-main-inverse': atlasColors.text.inverse,
} as CSSProperties;

/**
 * 메인 헤더 레이아웃
 *
 * <p>
 * 메인 헤더 UI 를 보여주는 레이아웃입니다.<br>
 * 로고와 메뉴를 포함하고 있습니다.
 * </p>
 *
 */
const HeaderMainLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // 마이 페이지 패널을 띄울 기준 버튼. null이면 닫힌 상태.
  const [myPageAnchor, setMyPageAnchor] = useState<HTMLElement | null>(null);

  const toggleMyPage = (event: MouseEvent<HTMLElement>) => {
    setMyPageAnchor((prev) => (prev ? null : event.currentTarget));
  };

  return (
    <Container className={'header-main-layout'} maxWidth={false} component="section" style={mainStyle}>
      <div className="header-main-layout__inner">
        <a className="header-main-layout__brand" href="/" aria-label="Atlas Flight 홈">
          <img
            //width={}
            className="header-main-layout__logo"
            src="/logo/atlas-flight-combined.svg"
            alt="Atlas Flight"
            draggable={false}
          />
        </a>

        <nav className="header-main-layout__nav" aria-label="주요 메뉴">
          {navigationItems.map((item) => (
            <Button key={item} className="header-main-layout__nav-item" endIcon={<ExpandMoreIcon />}>
              {item}
            </Button>
          ))}
        </nav>

        <div className="header-main-layout__actions">
          <IconButton className="header-main-layout__search" aria-label="검색">
            <SearchIcon />
          </IconButton>
          <Button className="header-main-layout__booking" variant="contained">
            항공권 예매
          </Button>
          {isAuthenticated && (
            <Button
              className="header-main-layout__mypage"
              variant="outlined"
              startIcon={<PersonOutlineIcon />}
              onClick={toggleMyPage}
              aria-haspopup="dialog"
              aria-expanded={Boolean(myPageAnchor)}
            >
              마이 페이지
            </Button>
          )}
          <IconButton className="header-main-layout__menu" aria-label="전체 메뉴">
            <MenuIcon />
          </IconButton>
        </div>
      </div>

      <MyPagePanel anchorEl={myPageAnchor} onClose={() => setMyPageAnchor(null)} />
    </Container>
  );
};

export default HeaderMainLayout;
