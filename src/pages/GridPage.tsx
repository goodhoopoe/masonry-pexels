import { styled } from '@linaria/react';
import { Grid } from '../components/Grid/';

const Container = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 32px;
`;

export function GridPage() {
  return (
    <Container>
      <Title>Pexels Gallery</Title>
      <Grid />
    </Container>
  );
}
