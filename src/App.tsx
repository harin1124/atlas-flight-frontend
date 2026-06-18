import '@/style/reset.css';
import '@/App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from '@/pages/layout/DefaultLayout.tsx';
import Home from '@/pages/Home.tsx';
import LoginPage from '@/pages/login/LoginPage.tsx';
import MemberInfoPage from '@/pages/my-page/MemberInfoPage.tsx';
import RequireAuth from '@/routes/RequireAuth.tsx';
import GuestOnly from '@/routes/GuestOnly.tsx';
import GlobalToast from '@/components/GlobalToast.tsx';
import { appTheme } from '@/theme/theme';

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <GlobalToast />
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            {/* 공개 — 누구나 접근 가능 */}
            <Route path={'/'} element={<Home />} />

            {/* 게스트 전용 — 이미 로그인했으면 메인으로 */}
            <Route element={<GuestOnly />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* 로그인 필요 — 비로그인이면 로그인 페이지로 */}
            <Route element={<RequireAuth />}>
              <Route path="/my-page/member-info" element={<MemberInfoPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
