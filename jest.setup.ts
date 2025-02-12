import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    // Using underscore prefix to indicate intentionally unused parameters
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}

  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: readonly number[] = [];
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Define type for import.meta
declare global {
  interface ImportMetaEnv {
    VITE_PEXELS_API_KEY: string;
    [key: string]: string | undefined;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Mock import.meta.env
const env: ImportMetaEnv = {
  VITE_PEXELS_API_KEY: 'test-api-key',
};

(global as any).import = {
  meta: {
    env,
  },
};

// Mock fetch
global.fetch = jest.fn();
