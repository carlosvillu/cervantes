# @cervantes/client

Official TypeScript client for Cervantes API - Interactive book/story editor that enables developers to create choose-your-own-adventure style books with AI-generated cover images.

## ✅ Phase 1 Complete: Authentication & Foundation
## ✅ Phase 2 Complete: Content Management Core
## ✅ Phase 3.1 Complete: Interactive Features & Links

This package has completed **Phase 1**, **Phase 2**, and **Phase 3.1** of the Cervantes TypeScript Client implementation, including:

### Phase 1 - Foundation ✅
- Complete authentication module with all 6 auth endpoints
- Advanced token management with automatic refresh
- HTTP client foundation with error handling and retry logic

### Phase 2 - Content Management Core ✅ 
- **Book Management**: Complete book CRUD operations with business logic validation
- **Chapter Management**: Full chapter lifecycle with book relationships
- **Body/Content Management**: Hash-based versioning system for content storage
- **User Management**: Current user retrieval and permissions
- 161 comprehensive tests with 100% coverage across all modules

### Phase 3.1 - Interactive Features & Links ✅
- **Link Management**: Create connections between chapters for interactive narratives
- **Options & Direct Links**: Support for choice-based and automatic navigation
- **Business Logic Validation**: Prevents circular references and invalid connections
- **Interactive Navigation**: Build choose-your-own-adventure experiences
- 47 additional tests bringing total to 236 tests

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
import { CervantesClient, ConsoleLogger, NoOpLogger } from '@cervantes/client'

// Initialize client with default settings
const client = new CervantesClient({
  baseURL: 'https://api.bookadventur.es',
  timeout: 30000,
  retries: 3,
  debug: false  // Uses NoOpLogger by default for production
})

// Or enable logging for development
const devClient = new CervantesClient({
  baseURL: 'https://api.bookadventur.es',
  debug: true  // Uses ConsoleLogger when debug is true
})

// Or provide a custom logger
const customClient = new CervantesClient({
  baseURL: 'https://api.bookadventur.es',
  logger: new ConsoleLogger()  // Explicit logger override
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

// Link Management (New in Phase 3.1)
try {
  // Create interactive links between chapters
  const optionsLink = await client.createOptionsLink(
    'chapter-1-id',
    'chapter-2-id', 
    'Turn left down the dark corridor',
    book.getId()
  )

  const directLink = await client.createDirectLink(
    'chapter-1-id',
    'chapter-3-id',
    'Continue to the next scene',
    book.getId()
  )

  // Get all links from a chapter
  const allLinks = await client.getLinksFromChapter({
    fromChapterID: 'chapter-1-id'
  })
  console.log(`Chapter has ${allLinks.length} possible paths`)

  // Find specific link
  const foundLink = await client.findLinkByID({ id: optionsLink.getId() })

  // Advanced usage with LinkService
  const linkService = client.getLinkService()
  
  // Get only option-type links (reader choices)
  const optionsOnly = await linkService.getOptionsFromChapter('chapter-1-id')
  
  // Get only direct links (automatic progression)
  const directOnly = await linkService.getDirectLinksFromChapter('chapter-1-id')

  // Check if link exists
  const exists = await linkService.exists(optionsLink.getId())

  // Delete a link
  await client.deleteLink({ id: optionsLink.getId() })

} catch (error) {
  console.error('Link operation failed:', error.message)
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

### Chapter Management Module ✅
- ✅ **CRUD Operations** (create, read, update, delete chapters)
- ✅ **Book Relationships** (chapters belong to books)
- ✅ **Sorting & Filtering** (by creation date, title, book)
- ✅ **Business Logic Validation** (title/summary requirements)

### Link Management Module ✅
- ✅ **Interactive Navigation** (create choose-your-own-adventure connections)
- ✅ **Link Types** (options for choices, direct for automatic flow)
- ✅ **CRUD Operations** (create, read, delete links)
- ✅ **Business Logic Validation** (prevents circular references)
- ✅ **Filtering Methods** (by type, description, chapter)

### User Management Module ✅
- ✅ **Current User** (get authenticated user information)
- ✅ **Permissions** (check user access levels)
- ✅ **Profile Management** (user data retrieval)

### Logging & Observability ✅
- ✅ **Configurable Logger** (custom logging integration)
- ✅ **Built-in Loggers** (ConsoleLogger, NoOpLogger)
- ✅ **Production-safe defaults** (no console pollution)
- ✅ **Debug mode** (detailed logging for development)

### Coming Soon 🚧
- ⏳ **AI Image Generation** (book covers, chapter illustrations)
- ⏳ **Upload Management** (file handling for images)
- ⏳ **Offline Support** with caching and sync
- ⏳ **Framework Integrations** (React hooks, Vue composables)

## Advanced Configuration

### Custom Logger Integration

The client supports custom logger integration for integration with your application's logging system (Winston, Pino, etc.):

```typescript
import { CervantesClient, type Logger } from '@cervantes/client'

// Integrate with your logging system
class CustomLogger implements Logger {
  debug(message: string, context?: unknown): void {
    myAppLogger.debug(message, context)
  }

  info(message: string, context?: unknown): void {
    myAppLogger.info(message, context)
  }

  warn(message: string, context?: unknown): void {
    myAppLogger.warn(message, context)
  }

  error(message: string, error?: Error | unknown): void {
    myAppLogger.error(message, error)
  }
}

const client = new CervantesClient({
  baseURL: 'https://api.bookadventur.es',
  logger: new CustomLogger()
})
```

**Built-in Loggers:**
- `ConsoleLogger` - Uses console.log/error/warn/debug for output
- `NoOpLogger` - Discards all log messages (production default)

**Default Behavior:**
- `debug: false` (default) → Uses `NoOpLogger` (no output)
- `debug: true` → Uses `ConsoleLogger` (logs to console)
- `logger: customLogger` → Uses your custom logger (overrides debug setting)

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
| **Chapter** | ✅ Chapter, CreateChapterRequest, etc. | ✅ HTTPChapterRepository | ✅ 5 Use Cases | ✅ ChapterService | ✅ 23 tests | **Complete** |
| **Body** | ✅ Body, CreateBodyRequest, etc. | ✅ HTTPBodyRepository | ✅ 4 Use Cases | ✅ BodyService | ✅ 41 tests | **Complete** |
| **Link** | ✅ Link, CreateLinkRequest, etc. | ✅ HTTPLinkRepository | ✅ 4 Use Cases | ✅ LinkService | ✅ 47 tests | **Complete** |
| **User** | ✅ User, UserPermissions, etc. | ✅ HTTPUserRepository | ✅ 1 Use Case | ✅ UserService | ✅ 18 tests | **Complete** |

**Total**: 236 tests passing • 23 endpoints implemented • 6 modules complete

### HTTP Client Foundation

The HTTP layer includes:
- **HTTPClient**: Core HTTP client with Fetch API
- **Interceptors**: Auth token injection and error logging
- **Error Mapping**: HTTP status codes to domain errors
- **Retry Logic**: Exponential backoff for recoverable failures
- **Type Safety**: Zod schema validation for all responses

## License

ISC