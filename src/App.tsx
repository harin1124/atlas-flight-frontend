import '@/style/reset.css';
import '@/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from '@/pages/layout/DefaultLayout.tsx';
import Home from '@/pages/Home.tsx';
import LoginPage from '@/pages/login/LoginPage.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DefaultLayout />}>
          <Route path={'/'} element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
