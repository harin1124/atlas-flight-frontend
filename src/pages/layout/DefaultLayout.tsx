import { Outlet } from 'react-router-dom';
import HeaderUtilLayout from './HeaderUtilLayout.tsx';
import HeaderMainLayout from './HeaderMainLayout.tsx';

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
