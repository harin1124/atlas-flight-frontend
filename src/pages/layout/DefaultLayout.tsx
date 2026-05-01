import { Outlet } from 'react-router-dom';
import HeaderUtilLayout from '@/pages/layout/HeaderUtilLayout.tsx';
import HeaderMainLayout from '@/pages/layout/HeaderMainLayout.tsx';

const DefaultLayout = () => {
  return (
    <>
      <HeaderUtilLayout />
      <HeaderMainLayout />
      <Outlet />
    </>
  );
};

export default DefaultLayout;
