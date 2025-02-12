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
        navigate('/', { replace: true });
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

  if (!photoDetails) {
    return <Container role="alert">Photo not found</Container>;
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

      <ImageContainer>
        <img
          src={photoDetails.src.original}
          alt={`Photo by ${photoDetails.photographer}`}
          aria-describedby="photo-meta"
        />
      </ImageContainer>

      <InfoSection id="photo-meta">
        <Photographer>
          <h2>Photographer: {photoDetails.photographer}</h2>
        </Photographer>

        <MetaInfo role="list">
          <MetaItem role="listitem">
            <h4 id="dimensions-label">Dimensions</h4>
            <p aria-labelledby="dimensions-label">
              {photoDetails.width} × {photoDetails.height}
            </p>
          </MetaItem>

          <MetaItem role="listitem">
            <h4 id="original-label">View Original</h4>
            <p aria-labelledby="original-label">
              <a
                href={photoDetails.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open original photo on Pexels (opens in new tab)"
              >
                Open on Pexels
              </a>
            </p>
          </MetaItem>
        </MetaInfo>
      </InfoSection>
    </Container>
  );
}
