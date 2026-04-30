import '@/pages/layout/style/headerMainLayout.scss';
import { Container } from '@mui/material';

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
  return (
    <Container className={'header-main-layout'}>
      <h1>ATLAS FLIGHT</h1>
    </Container>
  );
};

export default HeaderMainLayout;
