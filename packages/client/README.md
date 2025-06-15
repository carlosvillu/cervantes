# @cervantes/client

Official TypeScript client for Cervantes API - Interactive book/story editor that enables developers to create choose-your-own-adventure style books with AI-generated cover images.

## 🚧 Work in Progress

This package is currently under active development as part of Phase 1 of the Cervantes TypeScript Client implementation.

## Installation

```bash
npm install @cervantes/client
# or
yarn add @cervantes/client
# or
pnpm add @cervantes/client
```

## Usage

```typescript
import { CervantesClient } from '@cervantes/client'

const client = new CervantesClient({
  baseURL: 'https://api.bookadventur.es',
  // Configuration options will be documented here
})

// Usage examples will be added as features are implemented
```

## Features (Planned)

- ✅ TypeScript-first with full type safety
- ✅ Clean Architecture following project patterns
- ⏳ Complete API coverage (47 endpoints)
- ⏳ Authentication & token management
- ⏳ Book and chapter management
- ⏳ Interactive narrative links
- ⏳ AI-powered image generation
- ⏳ Offline support with caching
- ⏳ Framework integrations (React, Vue)

## Development

```bash
# Install dependencies
npm install

# Development mode with watch
npm run dev

# Run tests
npm run test

# Build package
npm run build

# Lint code
npm run lint
```

## Architecture

This client follows Clean Architecture principles with three main layers:

- **Domain**: Business logic and entities
- **Infrastructure**: External service implementations (HTTP, cache, storage)
- **Application**: Public APIs and client interface

## License

ISC