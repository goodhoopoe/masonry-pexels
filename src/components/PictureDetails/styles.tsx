import { styled } from '@linaria/react';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const BackButton = styled.button`
  padding: 8px 16px;
  background: #05a081;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  transition: background 0.2s ease;

  &:hover {
    background: #048669;
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

export const InfoSection = styled.div`
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Photographer = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
`;

export const MetaItem = styled.div`
  h4 {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 4px;
  }

  p {
    font-size: 1rem;
    color: #333;
  }

  a {
    color: #05a081;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
