import { useState, useEffect, useCallback } from 'react';
import { MasonryGrid, ImageCard, ImageInfo, LoadMoreButton, LoadingSpinner } from './styles';
import type { Image, PexelsResponse } from './types';

const PER_PAGE = 30;

export function Grid() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchImages = useCallback(async (pageNum: number) => {
    try {
      const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
      const response = await fetch(
        `https://api.pexels.com/v1/curated?per_page=${PER_PAGE}&page=${pageNum}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      const data: PexelsResponse = await response.json();

      if (pageNum === 1) {
        setImages(data.photos);
      } else {
        setImages(prev => [...prev, ...data.photos]);
      }

      // Check if we've reached the end
      setHasMore(data.next_page !== null && data.photos.length === PER_PAGE);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchImages(nextPage);
  };

  if (loading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  return (
    <>
      <MasonryGrid>
        {images.map(image => (
          <ImageCard key={image.id}>
            <img src={image.src.large} alt={`Photo by ${image.photographer}`} loading="lazy" />
            <ImageInfo>
              <p>{image.photographer}</p>
            </ImageInfo>
          </ImageCard>
        ))}
      </MasonryGrid>

      {hasMore && (
        <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading...' : 'Load More'}
        </LoadMoreButton>
      )}
    </>
  );
}
