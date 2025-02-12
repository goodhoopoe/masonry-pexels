# masonry-pexels

### Installation

1. Clone the repository:

```bash
git clone https://github.com/goodhoopoe/masonry-pexels.git
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

### Run all tests

```bash
npm run test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Generate coverage report

```bash
npm run test:coverage
```

## Design Decisions

- Component-based architecture with clear separation of concerns
- Custom hooks for complex logic (virtualization, data fetching)
- TypeScript for type safety
- Linaria for static css generation during build

### Performance

- Virtualization for handling large image lists efficiently
- Lazy loading of images
- Debounced resize handlers
- Memoized callbacks and values
- Keeping lighthouse metrics for performance over 90

### Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly loading states

### Testing

- Unit tests for components and hooks
- Integration tests for user interactions
- Mock implementations for external dependencies

### Possible improvements:

- Rewrite integration tests to use cypress/playwright instead of react-testing-library
