# @cervantes/client

Official TypeScript client for Cervantes API - Interactive book/story editor that enables developers to create choose-your-own-adventure style books with AI-generated cover images.

## ✅ Phase 1 Complete: Authentication & Foundation

This package has completed **Phase 1** of the Cervantes TypeScript Client implementation, including:
- Complete authentication module with all 6 auth endpoints
- Advanced token management with automatic refresh
- HTTP client foundation with error handling and retry logic
- 57 comprehensive tests with 100% core functionality coverage

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

// Initialize client
const client = new CervantesClient({
  baseURL: 'https://api.bookadventur.es',
  timeout: 30000,
  retries: 3,
  debug: false
})

// Complete authentication flow
try {
  // Sign up new user
  await client.auth.signup({
    email: 'user@example.com',
    password: 'securePassword123'
  })

  // Login to get tokens
  const tokens = await client.auth.login({
    email: 'user@example.com',
    password: 'securePassword123'
  })

  // Tokens are automatically managed with auto-refresh
  console.log('Authenticated:', client.auth.isAuthenticated())

  // Send email validation code
  const validationToken = await client.auth.sendValidationCode()
  
  // Verify email with code
  await client.auth.verifyEmail({
    token: validationToken.getToken(),
    code: '123456'
  })

} catch (error) {
  console.error('Authentication failed:', error.message)
}
```

## Features

- ✅ **TypeScript-first** with full type safety
- ✅ **Clean Architecture** following project patterns  
- ✅ **HTTP Client Foundation** with Fetch API
- ✅ **Complete Authentication Module** (signup, login, refresh, logout, email verification)
- ✅ **Advanced Token Management** with precise auto-refresh timing
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