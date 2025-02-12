export const mockPexelsResponse = {
  page: 1,
  per_page: 10,
  photos: [
    {
      id: 1,
      width: 1000,
      height: 800,
      url: 'https://example.com/1',
      photographer: 'Test 1',
      src: { original: 'https://example.com/1', large: 'https://example.com/1' },
      alt: 'Test 1',
    },
    {
      id: 2,
      width: 800,
      height: 1000,
      url: 'https://example.com/2',
      photographer: 'Test 2',
      src: { original: 'https://example.com/2', large: 'https://example.com/2' },
      alt: 'Test 2',
    },
  ],
  total_results: 2,
};
