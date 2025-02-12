import { Routes, Route } from 'react-router-dom';
import { styled } from '@linaria/react';
import { GridPage } from './pages/GridPage';
import { PictureDetailPage } from './pages/PictureDetailPage';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
`;

export function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<GridPage />} />
        <Route path="/picture/:id" element={<PictureDetailPage />} />
      </Routes>
    </AppContainer>
  );
}
