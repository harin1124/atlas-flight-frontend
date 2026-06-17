import '@/pages/mypage/style/memberInfoPage.scss';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Container } from '@mui/material';
import { Navigate } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { atlasColors } from '@/theme/colors';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { getCustomer } from '@/api/services/customer/customerApis';
import type { CustomerDetail } from '@/api/services/customer/types';

const pageStyle = {
  '--mi-bg': atlasColors.background.elevated,
  '--mi-subtle': atlasColors.background.subtle,
  '--mi-highlight': atlasColors.background.brandSubtle,
  '--mi-border': atlasColors.border.default,
  '--mi-border-subtle': atlasColors.border.subtle,
  '--mi-brand': atlasColors.brand.navy,
  '--mi-strong': atlasColors.text.strong,
  '--mi-text': atlasColors.text.default,
  '--mi-muted': atlasColors.text.muted,
  '--mi-faint': atlasColors.text.subtle,
} as CSSProperties;

/** 성별 코드 → 표시 라벨. (백엔드 CustomerCreateRequest 예시 기준: MALE/FEMALE) */
const GENDER_LABEL: Record<string, string> = {
  MALE: '남자',
  FEMALE: '여자',
  M: '남자',
  F: '여자',
};

const PASSWORD_MASK = '•'.repeat(10);

/** ISO 날짜/일시 문자열(yyyy-MM-dd...)을 "yyyy년 MM월 dd일" 형태로. 비어 있으면 빈 문자열. */
const formatKoreanDate = (value?: string | null) => {
  if (!value) return '';
  const [year, month, day] = value.slice(0, 10).split('-');
  if (!year || !month || !day) return '';
  return `${year}년 ${month}월 ${day}일`;
};

/** 회원번호를 4자리씩 끊어 보기 좋게. (예: 121829508263 → 1218 2950 8263) */
const formatMemberNumber = (value?: string | null) =>
  (value ?? '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();

/**
 * 회원정보 페이지
 *
 * <p>
 * 헤더 마이 페이지 패널에서 이름을 누르면 이동하는 회원 전용 페이지입니다. 이름·회원번호·아이디는
 * 인증 스토어(authStore)에서 즉시 그려주고, 생년월일·성별·연락처·이메일·가입일은 고객 상세
 * API(GET /customers/{customerId})로 채웁니다. 상세 조회가 실패해도 스토어 기반 기본 정보는 그대로
 * 보이도록(graceful degradation) 설계했습니다.
 * </p>
 */
const MemberInfoPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const showToast = useToastStore((state) => state.showToast);

  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const customerId = user?.customerId;

  useEffect(() => {
    if (!customerId) {
      setIsLoading(false);
      return;
    }

    let alive = true;
    setIsLoading(true);
    setLoadFailed(false);

    getCustomer(customerId)
      .then((data) => {
        if (alive) setDetail(data);
      })
      .catch(() => {
        // 401(세션 만료)은 client.ts 인터셉터가 처리한다. 그 외 실패는 기본 정보만 노출한다.
        if (alive) setLoadFailed(true);
      })
      .finally(() => {
        if (alive) setIsLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [customerId]);

  // 회원 전용 페이지 — 비로그인 상태면 로그인으로 보낸다.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 변경/바로가기 화면은 추후 연동 예정. 지금은 안내 토스트만 띄운다.
  const handleNotReady = () => showToast('준비 중인 기능입니다.');

  // 상세(API)가 있으면 성/이름을 정확히 분리해 보여주고, 없으면 스토어의 합쳐진 이름으로 대체한다.
  const engName = detail
    ? `${detail.engLastName} / ${detail.engFirstName}`.toUpperCase()
    : user.userEngName || '-';
  const korName = detail ? `${detail.korLastName} / ${detail.korFirstName}` : user.userKorName || '-';
  const memberNumber = formatMemberNumber(user.customerNumber) || '-';
  const joinDate = formatKoreanDate(detail?.regDt);

  // 상세에서만 오는 값들 — 로딩 중엔 안내, 실패/없음이면 '-'.
  const detailValue = (value: string) => value || (isLoading ? '불러오는 중…' : '-');
  const gender = detail ? (GENDER_LABEL[detail.genderCd] ?? detail.genderCd) : '';

  const basicRows = [
    { label: '생년월일', value: detailValue(formatKoreanDate(detail?.birthday)) },
    { label: '성별', value: detailValue(gender) },
    { label: '휴대전화 번호', value: detailValue(detail?.phoneNumber ?? '') },
    { label: '이메일 주소', value: detailValue(detail?.email ?? '') },
    { label: '비밀번호', value: PASSWORD_MASK },
  ];

  const shortcuts = [
    {
      icon: <PublicOutlinedIcon className="member-info__shortcut-icon" />,
      title: '여행서류 정보',
      desc: '여권, 영주권, KTN 정보를 등록하거나 변경할 수 있어요.',
    },
    {
      icon: <HomeOutlinedIcon className="member-info__shortcut-icon" />,
      title: '주소 및 기타 정보',
      desc: '주소, 회사정보, 선호언어를 등록하거나 변경할 수 있어요.',
    },
    {
      icon: <VerifiedUserOutlinedIcon className="member-info__shortcut-icon" />,
      title: '개인정보 활용 동의',
      desc: '마케팅 광고 활용 및 수신 동의, 개인정보 제3자 제공 동의 설정을 변경할 수 있어요.',
    },
  ];

  return (
    <Container maxWidth="lg" component="main" className="member-info" style={pageStyle}>
      <h1 className="member-info__title">회원정보</h1>

      {loadFailed && (
        <p className="member-info__notice" role="status">
          일부 회원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {/* 요약: 이름 / 회원번호 / 아이디 */}
      <section className="member-info__summary">
        <div className="member-info__summary-card member-info__summary-card--highlight">
          <div className="member-info__summary-names">
            <div className="member-info__field">
              <span className="member-info__field-label">영문 성 / 영문 이름</span>
              <span className="member-info__field-value">{engName}</span>
            </div>
            <div className="member-info__field">
              <span className="member-info__field-label">한글 성 / 한글 이름</span>
              <span className="member-info__field-value">{korName}</span>
            </div>
          </div>
          <button type="button" className="member-info__change" onClick={handleNotReady}>
            변경
            <ChevronRightIcon className="member-info__change-arrow" />
          </button>
        </div>

        <div className="member-info__summary-card">
          <span className="member-info__field-label">회원번호</span>
          <span className="member-info__field-value member-info__field-value--mono">{memberNumber}</span>
          {joinDate && <span className="member-info__field-sub">( {joinDate} 가입 )</span>}
        </div>

        <div className="member-info__summary-card">
          <span className="member-info__field-label">아이디</span>
          <span className="member-info__field-value member-info__field-value--mono">{user.customerId}</span>
        </div>
      </section>

      {/* 기본 정보 */}
      <section className="member-info__panel">
        <h2 className="member-info__panel-title">기본 정보</h2>
        <div className="member-info__rows">
          {basicRows.map((row) => (
            <div className="member-info__row" key={row.label}>
              <span className="member-info__row-label">{row.label}</span>
              <span className="member-info__row-value">{row.value}</span>
              <button type="button" className="member-info__change" onClick={handleNotReady}>
                변경
                <ChevronRightIcon className="member-info__change-arrow" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 바로가기 카드 */}
      <section className="member-info__shortcuts">
        {shortcuts.map((item) => (
          <button
            type="button"
            className="member-info__shortcut"
            key={item.title}
            onClick={handleNotReady}
          >
            {item.icon}
            <span className="member-info__shortcut-body">
              <span className="member-info__shortcut-title">{item.title}</span>
              <span className="member-info__shortcut-desc">{item.desc}</span>
            </span>
            <ChevronRightIcon className="member-info__shortcut-arrow" />
          </button>
        ))}
      </section>

      <button type="button" className="member-info__withdraw" onClick={handleNotReady}>
        회원탈퇴
      </button>
    </Container>
  );
};

export default MemberInfoPage;
