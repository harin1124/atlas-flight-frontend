import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * 로그인이 필요한 페이지를 감싸는 가드.
 *
 * 비로그인 상태면 로그인 페이지로 돌려보낸다. 이때 원래 가려던 위치를 state.from 에 실어,
 * 로그인 성공 후 그 페이지로 복귀시킬 수 있게 한다.
 *
 * 주의: 이 가드는 UX용이다(즉각 차단·콘텐츠 깜빡임 방지). isAuthenticated 는 localStorage 에
 * persist 되어 쿠키가 만료된 뒤에도 stale 하게 true 로 남을 수 있다. 실제 차단은 보호 페이지의
 * API 호출이 게이트웨이 401 을 받는 순간 client.ts 인터셉터가 clearAuth + 메인 이동으로 처리한다.
 * 즉 인증의 소스 오브 트루스는 여전히 쿠키이고, 여기는 빠른 1차 게이트일 뿐이다.
 */
const RequireAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
