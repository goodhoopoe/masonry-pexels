import { Routes, Route } from 'react-router-dom';
import { styled } from '@linaria/react';
import { Grid } from './pages/Grid';
import { PictureDetail } from './pages/PictureDetail';

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
        <Route path="/" element={<Grid />} />
        <Route path="/picture/:id" element={<PictureDetail />} />
      </Routes>
    </AppContainer>
  );
}
