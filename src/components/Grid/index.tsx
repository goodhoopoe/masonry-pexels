import { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MasonryGrid, ImageCard, ImageInfo, LoadMoreButton, LoadingSpinner } from './styles';
import { useVirtualization } from './useVirtualization';
import type { Image, PexelsResponse } from './types';

const PER_PAGE = 30;

export function Grid() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const { virtualItems, containerHeight } = useVirtualization(images);

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

      setImages(prev => {
        const existingIds = new Set(prev.map(img => img.id));
        const newImages = data.photos.filter(img => !existingIds.has(img.id));

        return prev.concat(newImages);
      });

      // Check if we've reached the end
      setHasMore(data.next_page !== null);
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

  const handleImageClick = (imageId: number) => {
    navigate(`/picture/${imageId}`);
  };

  const handleImageKeyDown = (e: KeyboardEvent<HTMLDivElement>, imageId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleImageClick(imageId);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner role="status" aria-live="polite">
        Loading images...
      </LoadingSpinner>
    );
  }

  return (
    <>
      <MasonryGrid
        role="grid"
        aria-label="Image gallery"
        style={{ height: containerHeight, position: 'relative' }}
      >
        <div role="row">
          {virtualItems.map(({ image, column, top }) => (
            <ImageCard
              key={image.id}
              onClick={() => handleImageClick(image.id)}
              onKeyDown={e => handleImageKeyDown(e, image.id)}
              role="gridcell"
              tabIndex={0}
              aria-label={`Photo by ${image.photographer}`}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top,
                left: column * (300 + 16),
                width: 300,
              }}
            >
              <img src={image.src.large} alt={`Photo by ${image.photographer}`} loading="lazy" />
              <ImageInfo>
                <p>{image.photographer}</p>
              </ImageInfo>
            </ImageCard>
          ))}
        </div>
      </MasonryGrid>

      {hasMore && (
        <LoadMoreButton
          onClick={handleLoadMore}
          disabled={loadingMore}
          aria-busy={loadingMore}
          aria-label={loadingMore ? 'Loading more images...' : 'Load more images'}
        >
          {loadingMore ? 'Loading...' : 'Load More'}
        </LoadMoreButton>
      )}
    </>
  );
}
