import '@/pages/layout/style/myPagePanel.scss';
import type { CSSProperties } from 'react';
import { Popover } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import { atlasColors } from '@/theme/colors';
import { useAuthStore } from '@/stores/authStore';

const panelStyle = {
  '--mypage-bg': atlasColors.background.elevated,
  '--mypage-border': atlasColors.border.default,
  '--mypage-border-subtle': atlasColors.border.subtle,
  '--mypage-brand': atlasColors.brand.navy,
  '--mypage-brand-soft': atlasColors.background.brandSubtle,
  '--mypage-accent': atlasColors.action.primary,
  '--mypage-sky': atlasColors.brand.sky,
  '--mypage-text': atlasColors.text.default,
  '--mypage-strong': atlasColors.text.strong,
  '--mypage-muted': atlasColors.text.muted,
  '--mypage-subtle': atlasColors.text.subtle,
  '--mypage-inverse': atlasColors.text.inverse,
  '--mypage-link': atlasColors.text.link,
} as CSSProperties;

/**
 * Atlas Flight 종이비행기 마크.
 *
 * 로고(atlas-flight-square.svg)와 동일한 두 삼각형 구성을 inline SVG로 재현해,
 * 멤버십 카드/히어로에 브랜드 마크로 쓴다. `currentColor`로 색을 받아 흰색·연한색 등
 * 배경에 맞춰 칠할 수 있게 했다.
 */
const AtlasMark = (props: { className?: string }) => (
  <svg viewBox="0 0 256 256" role="img" aria-label="Atlas Flight" {...props}>
    <g transform="translate(128 128) rotate(-22)">
      <path d="M -88 -44 L 88 0 L -26 0 Z" fill="currentColor" />
      <path d="M -26 0 L 88 0 L -70 44 Z" fill="currentColor" opacity="0.55" />
    </g>
  </svg>
);

interface MyPagePanelProps {
  /** 패널을 띄울 기준 엘리먼트 (마이 페이지 버튼). null이면 닫힌 상태. */
  anchorEl: HTMLElement | null;
  /** 패널을 닫을 때 호출된다. */
  onClose: () => void;
}

/**
 * 마이 페이지 미니 패널
 *
 * <p>
 * 헤더의 "마이 페이지" 버튼을 누르면 버튼 아래로 떠서, 회원 정보와 주요 메뉴를
 * 퀵 메뉴 형태로 보여주는 패널입니다. 이름·회원번호·회원아이디는 실제 인증 상태(authStore)에서
 * 가져오고, 예약 등 일부 항목은 전용 API가 생기기 전까지 레이아웃을 채우는 표시용입니다.
 * </p>
 */
const MyPagePanel = ({ anchorEl, onClose }: MyPagePanelProps) => {
  const user = useAuthStore((state) => state.user);

  // 메뉴 항목 클릭. 페이지 이동은 추후 기능 연동 시 붙인다. 지금은 패널만 닫는다.
  const go = () => {
    onClose();
  };

  // 회원 번호(customerNumber)를 4자리씩 끊어 보기 좋게 노출한다.
  const memberNo = (user?.customerNumber ?? '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { className: 'mypage-panel', style: panelStyle } }}
    >
      <div className="mypage-panel__hero">
        {/* Atlas 종이비행기 마크를 히어로 배경에 은은하게 깔아 브랜드감을 준다. */}
        <AtlasMark className="mypage-panel__hero-mark" aria-hidden />

        <div className="mypage-panel__hero-info">
          <button type="button" className="mypage-panel__profile" onClick={() => go()}>
            <span className="mypage-panel__name">{user?.userKorName ?? '회원'}</span>
            <span className="mypage-panel__greeting">님, 좋은 여행 되세요</span>
            <ChevronRightIcon className="mypage-panel__profile-arrow" />
          </button>
          {user?.userEngName && <span className="mypage-panel__eng-name">{user.userEngName}</span>}
        </div>

        <div className="mypage-panel__card" aria-hidden>
          <div className="mypage-panel__card-top">
            <AtlasMark className="mypage-panel__card-mark" />
            <span className="mypage-panel__card-brand">ATLAS CLUB</span>
          </div>
          <div className="mypage-panel__card-bottom">
            <span className="mypage-panel__card-no">{memberNo || '•••• •••• ••••'}</span>
          </div>
        </div>
      </div>

      <div className="mypage-panel__grid">
        {/* 회원 정보 */}
        <div className="mypage-panel__card-box mypage-panel__card-box--info">
          <div className="mypage-panel__row mypage-panel__row--static">
            <span className="mypage-panel__row-label">회원 번호</span>
            <span className="mypage-panel__row-value mypage-panel__row-value--mono">
              {memberNo || '-'}
              <ContentCopyIcon className="mypage-panel__row-icon" />
            </span>
          </div>
          <div className="mypage-panel__row mypage-panel__row--static">
            <span className="mypage-panel__row-label">회원 아이디</span>
            <span className="mypage-panel__row-value mypage-panel__row-value--mono">
              {user?.customerId ?? '-'}
            </span>
          </div>
        </div>

        {/* 예약 */}
        <button
          type="button"
          className="mypage-panel__card-box mypage-panel__reservation"
          onClick={() => go()}
        >
          <AtlasMark className="mypage-panel__reservation-icon" aria-hidden />
          <span className="mypage-panel__reservation-title">
            예약 <ChevronRightIcon className="mypage-panel__row-arrow" />
          </span>
          <span className="mypage-panel__reservation-empty">예약 내역이 없습니다.</span>
        </button>
      </div>

      {/* 하단 바로가기 */}
      <div className="mypage-panel__quick">
        <button type="button" className="mypage-panel__quick-link" onClick={() => go()}>
          <GroupAddOutlinedIcon className="mypage-panel__quick-icon" />
          <span className="mypage-panel__quick-label">가족 등록 신청</span>
          <ChevronRightIcon className="mypage-panel__row-arrow" />
        </button>
      </div>
    </Popover>
  );
};

export default MyPagePanel;
