import './style/reset.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from './pages/layout/DefaultLayout.tsx';
import Home from './pages/Home.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path={'/'} element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
