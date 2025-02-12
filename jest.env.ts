import { jest } from '@jest/globals';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Vite env variables
jest.mock('@vitejs/plugin-react', () => ({
  default: () => null,
}));

// Mock import.meta
(global as any).import = jest.fn();
(global as any).import.meta = {
  env: {
    VITE_PEXELS_API_KEY: 'test-api-key',
    // Add other env variables as needed
  },
};
