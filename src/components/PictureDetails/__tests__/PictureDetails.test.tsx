import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PictureDetails } from '../index';
import { mockPhotoDetails } from '../__mocks__/photoDetails';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('PictureDetails Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockNavigate.mockReset();
  });

  it('shows loading state initially', () => {
    render(
      <BrowserRouter>
        <PictureDetails id="1" />
      </BrowserRouter>
    );
    expect(screen.getByText('Loading image details...')).toBeInTheDocument();
  });

  it('renders photo details after successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotoDetails,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <PictureDetails id="1" />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading image details...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(mockPhotoDetails.photographer)).toBeInTheDocument();
    expect(screen.getByAltText(mockPhotoDetails.alt)).toBeInTheDocument();
    expect(screen.getByText('← Back to Gallery')).toBeInTheDocument();
  });

  it('navigates back when clicking back button', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotoDetails,
    });

    render(
      <BrowserRouter>
        <PictureDetails id="1" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading image details...')).not.toBeInTheDocument();
    });

    const backButton = screen.getByText('← Back to Gallery');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when pressing Enter on back button', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotoDetails,
    });

    render(
      <BrowserRouter>
        <PictureDetails id="1" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading image details...')).not.toBeInTheDocument();
    });

    const backButton = screen.getByText('← Back to Gallery');
    fireEvent.keyDown(backButton, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows error state when photo not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    });

    render(
      <BrowserRouter>
        <PictureDetails id="999" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading image details...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Photo not found')).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <PictureDetails id="1" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading image details...')).not.toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('displays correct metadata', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotoDetails,
    });

    render(
      <BrowserRouter>
        <PictureDetails id="1" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading image details...')).not.toBeInTheDocument();
    });

    const dimensionsText = `${mockPhotoDetails.width} × ${mockPhotoDetails.height} pixels`;
    expect(screen.getByText(dimensionsText)).toBeInTheDocument();
    expect(screen.getByText('Photographer')).toBeInTheDocument();
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
  });
});
