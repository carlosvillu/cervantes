# @cervantes/client

Official TypeScript client for Cervantes API - Interactive book/story editor that enables developers to create choose-your-own-adventure style books with AI-generated cover images.

## ✅ Phase 1 Complete: Authentication & Foundation
## ✅ Phase 2.1 Complete: Book Management  
## ✅ Phase 2.3 Complete: Body/Content Management

This package has completed **Phase 1**, **Phase 2.1**, and **Phase 2.3** of the Cervantes TypeScript Client implementation, including:

### Phase 1 - Foundation ✅
- Complete authentication module with all 6 auth endpoints
- Advanced token management with automatic refresh
- HTTP client foundation with error handling and retry logic

### Phase 2.1 - Book Management ✅ 
- Complete book CRUD operations (create, read, update, list)
- Business logic validation and error handling
- Convenience methods for common operations
- 25 comprehensive tests with 100% coverage

### Phase 2.3 - Body/Content Management ✅
- Complete content versioning system with hash-based storage
- Multiple retrieval methods (by ID, hash, chapter)
- Content creation, updating, and history tracking
- 41 comprehensive tests with full error handling
- Cross-platform UUID generation for Node.js 18+ compatibility

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

// Authentication Flow
try {
  // Sign up new user
  await client.signup({
    username: 'author123',
    email: 'user@example.com',
    password: 'securePassword123'
  })

  // Login to get tokens
  const tokens = await client.login({
    email: 'user@example.com',
    password: 'securePassword123'
  })

  // Tokens are automatically managed with auto-refresh
  console.log('Authenticated:', client.isAuthenticated())

} catch (error) {
  console.error('Authentication failed:', error.message)
}

// Book Management (New in Phase 2.1)
try {
  // Create a new book
  const book = await client.createSimpleBook(
    'My Adventure Story',
    'An epic choose-your-own-adventure tale'
  )

  // Get all user books
  const allBooks = await client.getAllBooks()
  console.log(`User has ${allBooks.length} books`)

  // Find specific book
  const foundBook = await client.findBookByID({ id: book.getId() })

  // Update book information
  const updatedBook = await client.updateBookBasicInfo(
    book.getId(),
    'My Epic Adventure Story',
    'An updated summary with more details'
  )

  // Publish the book
  await client.publishBook(book.getId())

  // Advanced usage with BookService
  const bookService = client.getBookService()
  const publishedBooks = (await bookService.getAll())
    .filter(book => book.isPublished())

} catch (error) {
  console.error('Book operation failed:', error.message)
}

// Body/Content Management
try {
  // Create content for a chapter
  const bodyContent = await client.createBody({
    bookID: book.getId(),
    userID: 'user-uuid',
    chapterID: 'chapter-uuid',
    content: 'Once upon a time, in a land far away...'
  })

  // Retrieve content by hash for versioning
  const sameContent = await client.findBodyByHash({
    hash: bodyContent.getHash()
  })

  // Get all content versions for a chapter
  const allVersions = await client.getAllBodiesByChapter({
    bookID: book.getId(),
    chapterID: 'chapter-uuid'
  })

  // Advanced usage with BodyService
  const bodyService = client.getBodyService()
  const latestContent = await bodyService.findByID({
    id: bodyContent.getId()
  })

} catch (error) {
  console.error('Content operation failed:', error.message)
}
```

## Features

### Core Features ✅
- ✅ **TypeScript-first** with full type safety
- ✅ **Clean Architecture** following project patterns  
- ✅ **HTTP Client Foundation** with Fetch API
- ✅ **Error Handling** with domain error mapping
- ✅ **Retry Logic** with exponential backoff
- ✅ **Request/Response Interceptors** for auth and debugging

### Authentication Module ✅
- ✅ **Complete Authentication** (signup, login, refresh, logout, email verification)
- ✅ **Advanced Token Management** with precise auto-refresh timing
- ✅ **Automatic Token Refresh** with callback system
- ✅ **Secure Token Storage** with LocalStorage/SessionStorage adapters

### Book Management Module ✅
- ✅ **CRUD Operations** (create, read, update, list books)
- ✅ **Business Logic Validation** (title/summary length, publication status)
- ✅ **Convenience Methods** (publish, unpublish, toggle status)
- ✅ **Comprehensive Testing** (82 tests total)

### Body/Content Management Module ✅
- ✅ **Content Versioning** (hash-based storage system)
- ✅ **Multiple Retrieval Methods** (by ID, hash, chapter)
- ✅ **Business Logic Validation** (content format, UUID validation)
- ✅ **Cross-platform Compatibility** (Node.js 18+ UUID generation)
- ✅ **Comprehensive Testing** (41 tests passing)

### Coming Soon 🚧
- ⏳ **Chapter Management** (create, edit, organize chapters) 
- ⏳ **Interactive Links** (choose-your-own-adventure connections)
- ⏳ **AI Image Generation** (book covers, chapter illustrations)
- ⏳ **User Management** (profiles, preferences)
- ⏳ **Offline Support** with caching and sync
- ⏳ **Framework Integrations** (React hooks, Vue composables)

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

- **Domain**: Business logic and entities (25+ domain models implemented)
- **Infrastructure**: External service implementations (HTTP client, interceptors, error handling)  
- **Application**: Public APIs and client interface (`CervantesClient`)

### Implementation Status

| Module | Domain Models | Repository | Use Cases | Service | Tests | Status |
|--------|---------------|------------|-----------|---------|-------|--------|
| **Auth** | ✅ AuthTokens, LoginRequest, etc. | ✅ HTTPAuthRepository | ✅ 6 Use Cases | ✅ AuthService | ✅ 57 tests | **Complete** |
| **Book** | ✅ Book, CreateBookRequest, etc. | ✅ HTTPBookRepository | ✅ 4 Use Cases | ✅ BookService | ✅ 25 tests | **Complete** |
| **Chapter** | ✅ Chapter, CreateChapterRequest, etc. | ✅ HTTPChapterRepository | ✅ 5 Use Cases | ✅ ChapterService | ✅ Complete | **Complete** |
| **Body** | ✅ Body, CreateBodyRequest, etc. | ✅ HTTPBodyRepository | ✅ 4 Use Cases | ✅ BodyService | ✅ 41 tests | **Complete** |
| **User** | ✅ User, UserPermissions, etc. | ✅ HTTPUserRepository | ✅ 1 Use Case | ✅ UserService | ✅ 18 tests | **Complete** |

### HTTP Client Foundation

The HTTP layer includes:
- **HTTPClient**: Core HTTP client with Fetch API
- **Interceptors**: Auth token injection and error logging
- **Error Mapping**: HTTP status codes to domain errors
- **Retry Logic**: Exponential backoff for recoverable failures
- **Type Safety**: Zod schema validation for all responses

## License

ISC