import { useEffect, useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from '../Grid/types';
import { PictureDetailsProps } from './types';
import {
  Container,
  BackButton,
  ImageContainer,
  InfoSection,
  Photographer,
  MetaInfo,
  MetaItem,
  PhotoTitle,
  PhotoDescription,
} from './styles';

export function PictureDetails({ id }: PictureDetailsProps) {
  const navigate = useNavigate();
  const [photoDetails, setPhotoDetails] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
        const response = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
          headers: {
            Authorization: apiKey,
          },
        });

        if (!response.ok) {
          throw new Error('Photo not found');
        }

        const data = await response.json();
        setPhotoDetails(data);
      } catch (error) {
        console.error('Error fetching photo details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoDetails();
  }, [id, navigate]);

  const handleBackKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('/');
    }
  };

  if (loading) {
    return (
      <Container role="status" aria-live="polite">
        Loading image details...
      </Container>
    );
  }

  return (
    <Container role="main" aria-label="Photo details">
      <BackButton
        onClick={() => navigate('/')}
        onKeyDown={handleBackKeyDown}
        aria-label="Back to gallery"
      >
        ← Back to Gallery
      </BackButton>

      {!photoDetails && <Container role="alert">Photo not found</Container>}

      {!!photoDetails && (
        <>
          <ImageContainer>
            <img
              src={photoDetails.src.large}
              alt={photoDetails.alt || `Photo by ${photoDetails.photographer}`}
              aria-describedby="photo-meta"
            />
          </ImageContainer>

          <InfoSection id="photo-meta">
            <PhotoTitle>{photoDetails.alt || 'Untitled Photo'}</PhotoTitle>

            <PhotoDescription>{photoDetails.alt && <p>{photoDetails.alt}</p>}</PhotoDescription>

            <Photographer>
              <h2>Photographer</h2>
              {photoDetails.photographer}
            </Photographer>

            <MetaInfo role="list">
              <MetaItem role="listitem">
                <h4 id="dimensions-label">Dimensions</h4>
                <p aria-labelledby="dimensions-label">
                  {photoDetails.width} × {photoDetails.height} pixels
                </p>
              </MetaItem>
            </MetaInfo>
          </InfoSection>
        </>
      )}
    </Container>
  );
}
