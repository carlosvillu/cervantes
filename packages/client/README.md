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

// Basic client setup
const client = new CervantesClient({
  baseURL: 'https://api.bookadventur.es',
  timeout: 30000,
  retries: 3,
  debug: false
})

// Authentication token management
client.setAuthTokens('access-token', 'refresh-token')
console.log(client.hasValidTokens()) // true

// Access HTTP client for advanced usage
const httpClient = client.getHTTPClient()
const [error, data] = await httpClient.get('/user/current')

if (error) {
  console.error('Request failed:', error.message)
} else {
  console.log('User data:', data)
}
```

## Features

- ✅ **TypeScript-first** with full type safety
- ✅ **Clean Architecture** following project patterns  
- ✅ **HTTP Client Foundation** with Fetch API
- ✅ **Authentication & Token Management** with automatic refresh
- ✅ **Error Handling** with domain error mapping
- ✅ **Retry Logic** with exponential backoff
- ✅ **Request/Response Interceptors** for auth and debugging
- ⏳ Complete API coverage (47 endpoints)
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

- **Domain**: Business logic and entities (25 domain models implemented)
- **Infrastructure**: External service implementations (HTTP client, interceptors, error handling)
- **Application**: Public APIs and client interface (`CervantesClient`)

### HTTP Client Foundation

The HTTP layer includes:
- **HTTPClient**: Core HTTP client with Fetch API
- **Interceptors**: Auth token injection and error logging
- **Error Mapping**: HTTP status codes to domain errors
- **Retry Logic**: Exponential backoff for recoverable failures
- **Type Safety**: Zod schema validation for responses

## License

ISC