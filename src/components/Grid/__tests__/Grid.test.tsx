import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Grid } from '../index';
import { mockPexelsResponse } from '../__mocks__/pexelsResponse';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Grid Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockNavigate.mockReset();
  });

  it('shows loading state initially', () => {
    render(
      <BrowserRouter>
        <Grid />
      </BrowserRouter>
    );
    expect(screen.getByText('Loading images...')).toBeInTheDocument();
  });

  it('renders images after successful fetch', async () => {
    const mockResponse = {
      ...mockPexelsResponse,
      total_results: 100,
      per_page: 2,
      page: 1,
      next_page: 'https://api.pexels.com/v1/curated?page=2',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Grid />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading images...')).not.toBeInTheDocument();
    });

    expect(screen.getAllByRole('gridcell')).toHaveLength(mockPexelsResponse.photos.length);
    expect(screen.getByText('Load More')).toBeInTheDocument();
  });

  it('navigates to photo details when clicking an image', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPexelsResponse,
    });

    render(
      <BrowserRouter>
        <Grid />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading images...')).not.toBeInTheDocument();
    });

    const firstImage = screen.getAllByRole('gridcell')[0];
    fireEvent.click(firstImage);

    expect(mockNavigate).toHaveBeenCalledWith(`/picture/${mockPexelsResponse.photos[0].id}`);
  });

  it('navigates to photo details when pressing Enter on an image', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPexelsResponse,
    });

    render(
      <BrowserRouter>
        <Grid />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading images...')).not.toBeInTheDocument();
    });

    const firstImage = screen.getAllByRole('gridcell')[0];
    fireEvent.keyDown(firstImage, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith(`/picture/${mockPexelsResponse.photos[0].id}`);
  });

  it('handles duplicate images correctly', async () => {
    const duplicateResponse = {
      ...mockPexelsResponse,
      photos: [
        ...mockPexelsResponse.photos,
        { ...mockPexelsResponse.photos[0], id: mockPexelsResponse.photos[0].id + 100 },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => duplicateResponse,
    });

    render(
      <BrowserRouter>
        <Grid />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading images...')).not.toBeInTheDocument();
    });

    expect(screen.getAllByRole('gridcell')).toHaveLength(duplicateResponse.photos.length);
  });

  it('loads more images when clicking load more button', async () => {
    const firstResponse = {
      ...mockPexelsResponse,
      total_results: 100,
      per_page: 2,
      page: 1,
      next_page: 'https://api.pexels.com/v1/curated?page=2',
    };

    const secondResponse = {
      ...mockPexelsResponse,
      photos: mockPexelsResponse.photos.map(photo => ({ ...photo, id: photo.id + 100 })),
      page: 2,
      next_page: 'https://api.pexels.com/v1/curated?page=3',
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => firstResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => secondResponse,
      });

    render(
      <BrowserRouter>
        <Grid />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading images...')).not.toBeInTheDocument();
    });

    const loadMoreButton = await screen.findByText('Load More');
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      const cells = screen.getAllByRole('gridcell');
      expect(cells).toHaveLength(mockPexelsResponse.photos.length * 2);
    });
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Grid />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading images...')).not.toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('shows Load More button when next page is available', async () => {
    const mockResponse = {
      ...mockPexelsResponse,
      total_results: 100,
      per_page: 2,
      page: 1,
      next_page: 'https://api.pexels.com/v1/curated?page=2',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(
      <BrowserRouter>
        <Grid />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading images...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Load More')).toBeInTheDocument();
  });

  it('hides Load More button when no next page available', async () => {
    const mockResponse = {
      ...mockPexelsResponse,
      total_results: mockPexelsResponse.photos.length,
      per_page: mockPexelsResponse.photos.length,
      page: 1,
      next_page: null,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(
      <BrowserRouter>
        <Grid />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading images...')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });
});
