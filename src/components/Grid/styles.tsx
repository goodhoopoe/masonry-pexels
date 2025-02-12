import { styled } from '@linaria/react';

export const MasonryGrid = styled.div`
  columns: 5 300px;
  column-gap: 16px;
  padding: 16px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1600px) {
    columns: 4 300px;
  }

  @media (max-width: 1200px) {
    columns: 3 300px;
  }

  @media (max-width: 900px) {
    columns: 2 300px;
  }

  @media (max-width: 600px) {
    columns: 1 300px;
  }
`;

export const ImageCard = styled.div`
  position: relative;
  break-inside: avoid;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
`;

export const ImageInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ImageCard}:hover & {
    opacity: 1;
  }
`;

export const LoadMoreButton = styled.button`
  display: block;
  margin: 32px auto;
  padding: 12px 24px;
  background-color: #05a081;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #048669;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;
