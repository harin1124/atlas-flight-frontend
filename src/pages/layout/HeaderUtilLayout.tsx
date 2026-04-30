import '@/pages/layout/style/headerUtilLayout.scss';
import { Button, Container, ListItem } from '@mui/material';
import List from '@mui/material/List';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

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
  return (
    <Container className={'header-util-layout'} maxWidth={false}>
      <List>
        <ListItem>
          <Button variant={'text'} color={'inherit'} startIcon={<CardGiftcardIcon />}>
            <span>이벤트</span>
          </Button>
        </ListItem>
        <ListItem>
          <Button variant={'text'} color={'inherit'} startIcon={<PersonAddAltIcon />}>
            회원가입
          </Button>
        </ListItem>
      </List>
    </Container>
  );
};
export default HeaderUtilLayout;
