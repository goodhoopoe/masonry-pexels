import { useEffect, useState } from 'react';
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

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (!photoDetails) {
    return <Container>Photo not found</Container>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>← Back to Gallery</BackButton>

      <ImageContainer>
        <img src={photoDetails.src.original} alt={`Photo by ${photoDetails.photographer}`} />
      </ImageContainer>

      <InfoSection>
        <Photographer>Photographer: {photoDetails.photographer}</Photographer>

        <MetaInfo>
          <MetaItem>
            <h4>Dimensions</h4>
            <p>
              {photoDetails.width} × {photoDetails.height}
            </p>
          </MetaItem>

          <MetaItem>
            <h4>View Original</h4>
            <p>
              <a href={photoDetails.url} target="_blank" rel="noopener noreferrer">
                Open on Pexels
              </a>
            </p>
          </MetaItem>
        </MetaInfo>
      </InfoSection>
    </Container>
  );
}
