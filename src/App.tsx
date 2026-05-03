import '@/style/reset.css';
import '@/App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from '@/pages/layout/DefaultLayout.tsx';
import Home from '@/pages/Home.tsx';
import LoginPage from '@/pages/login/LoginPage.tsx';
import { appTheme } from '@/theme/theme';

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DefaultLayout />}>
            <Route path={'/'} element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
