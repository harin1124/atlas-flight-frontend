import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * 로그인 상태에서는 접근하면 안 되는 페이지(로그인 등)를 감싸는 가드.
 * 이미 로그인했으면 메인으로 돌려보낸다.
 */
const GuestOnly = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestOnly;
