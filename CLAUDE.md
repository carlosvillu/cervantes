# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cervantes is an interactive book/story editor built as a Node.js monorepo. It enables users to create choose-your-own-adventure style books with AI-generated cover images, rich text editing, and visual flow mapping of chapter relationships.

## Development Commands

### Primary Development Workflow
```bash
make dev                 # Start full development environment (Docker services + API + Editor)
make build_dev           # Build packages then start development
make compose_dev         # Start only Docker services (Redis, AI services)
```

### Individual App Development
```bash
# API (apps/api) - Express.js backend
npm run dev              # Development server with hot reload and debugging

# Editor (apps/editor) - React frontend  
npm run dev              # Vite dev server on port 3001
npm run build            # TypeScript compile + Vite build
npm run preview          # Preview production build
```

### Package Development
```bash
# Shared packages (packages/decorators)
npm run dev              # Watch mode build with tshy
npm run build            # Build dual format packages

# Client package (packages/client) - TypeScript API client
npm run generate:types   # Generate TypeScript types from OpenAPI spec
npm run build            # Build dual ESM/CommonJS with tshy
npm run dev              # Watch mode build
npm test                 # Run tests with Vitest
npm run lint             # ESLint with auto-fix
```

### Utility Commands
```bash
make clean               # Remove all build artifacts
make phoenix             # Clean reinstall of all dependencies
make deploy_api          # Deploy API to Fly.io  
make deploy_editor       # Deploy editor to Fly.io
```

## Architecture Overview

### Monorepo Structure
- **Apps**: `/apps/api` (Express backend), `/apps/editor` (React frontend), `/apps/fooocus` (Python AI service)
- **Packages**: `/packages/decorators` (shared utilities), `/packages/literals` (shared types), `/packages/client` (TypeScript API client)
- **Workspace Management**: npm workspaces with ultra-runner

### Clean Architecture Pattern
Both API and Editor follow Clean Architecture with three layers:

1. **Domain Layer**: Business logic (Use Cases, Models, Repositories)
   - Use Cases follow `UseCase<Input, Output>` interface with `execute` method
   - Repository pattern with multiple implementations (Redis, HTTP, LocalStorage)

2. **Infrastructure Layer**: External services (Redis, S3, HTTP clients)

3. **Application Layer**: Controllers, route handlers, React components

### Domain-Driven Design
Code is organized around business domains:
- **Auth**: Authentication/authorization with JWT and bcrypt
- **User**: User management and email verification via Resend
- **Book**: Book creation and management
- **Chapter**: Chapter content management
- **Link**: Chapter relationships for interactive narratives
- **Body**: Content versioning with hash-based storage
- **Image**: AI-generated covers via Fooocus service
- **Statics**: File uploads to AWS S3

### Client Package Architecture (`packages/client`)
TypeScript client library implementing Clean Architecture patterns:

#### **Domain Models Pattern**
- **Entities**: Business objects with identity (`User`, `Book`, `Chapter`)
  - Extend `Entity<T>` base class
  - Encapsulate business logic and validation
  - Immutable with getter methods
- **Value Objects**: Immutable data structures (`AuthTokens`, `Error`, `*Request` objects)
  - Extend `ValueObject<T>` base class
  - No identity, equality based on values
  - Used for API request/response data

#### **API Integration Pattern**
All domain models follow consistent patterns:
```typescript
// API deserialization
static fromAPI(data: ApiSchema): DomainModel
// API serialization  
toAPI(): ApiSchema
// Business validation
validate(): {isValid: boolean; errors: string[]}
```

#### **Type Safety & Validation**
- **Generated Types**: Auto-generated from `apps/api/openapi.yaml` using `openapi-typescript`
- **Runtime Validation**: Zod schemas for API data validation
- **Business Logic**: Custom validation methods for domain rules
- **Shared Utilities**: Common validation patterns in `domain/_shared/validation-utils.ts`

#### **Development Workflow**
1. Update OpenAPI spec in `apps/api/openapi.yaml`
2. Run `npm run generate:types` to update client types
3. Implement/update domain models with business logic
4. Write tests for domain models and business rules
5. Run `npm run lint` and `npm test` before commits

## Technology Stack

### Backend (API)
- **Runtime**: Node.js 21 with ESM modules (requires Node 21+)
- **Framework**: Express.js with TypeScript
- **Database**: Redis with Redis-OM for modeling
- **API Documentation**: OpenAPI 3.0 specification with Swagger UI
- **Development**: tsx with --watch flag for hot reloading

### Frontend (Editor)
- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: TailwindCSS 3 with HeadlessUI
- **Rich Text**: TipTap editor (ProseMirror-based)
- **Flow Diagrams**: ReactFlow with Dagre for chapter relationship visualization
- **Offline Support**: LocalForage for local storage

### Client Package (packages/client)
- **Language**: TypeScript with strict mode
- **Build System**: tshy for dual ESM/CommonJS builds
- **Validation**: Zod for runtime type validation
- **Type Generation**: openapi-typescript for API types
- **Testing**: Vitest with TypeScript support
- **Code Quality**: ESLint + Prettier with TypeScript rules
- **Architecture**: Clean Architecture with Domain Models

### Development Services
Docker Compose provides:
- **Redis Stack**: Primary database and caching
- **Fooocus AI**: Image generation service
- **DS Service**: Additional service on port 3002

## Key Implementation Details

### Shared Domain Logic
Frontend, backend, and client package share similar domain structures for consistency:
- **API**: Domain models with Redis-based repositories
- **Editor**: HTTP repositories for API calls + LocalStorage for offline
- **Client Package**: Domain models with `fromAPI()`/`toAPI()` patterns for seamless integration

Repository implementations vary by environment while maintaining consistent domain interfaces.

### Content Versioning
Body content uses hash-based versioning system for efficient storage and change tracking.

### AI Integration  
Image generation integrated via Docker-based Fooocus API service for automatic book/chapter cover creation.

### Interactive Flow Mapping
ReactFlow visualizes chapter relationships with drag-and-drop editing for creating branching narratives.

### API Documentation
- **OpenAPI Specification**: Located at `apps/api/openapi.yaml`
- **Swagger UI**: Available at `/api-docs` endpoint when API is running
- **Documentation Format**: OpenAPI 3.0 with comprehensive schemas and examples
- **Live Documentation**: Interactive API testing interface
- **Production URL**: https://api.bookadventur.es/api-docs

## Code Quality Best Practices

### Security & Validation
- **JWT Validation**: Always validate JWT structure before parsing (`token.split('.').length === 3`)
- **Input Sanitization**: Use Zod schemas for runtime validation of all API data
- **Password Security**: Never expose password getters; keep sensitive data redacted
- **Cross-browser Compatibility**: Use fallbacks for modern APIs (e.g., `crypto.randomUUID()`)

### Performance & Maintainability  
- **Shared Utilities**: Use `domain/_shared/validation-utils.ts` to avoid regex duplication
- **Cached Patterns**: Move regex to module constants for better performance
- **Type Safety**: Always add explicit return types for functions
- **Immutability**: Domain models should be immutable with getter methods only

### Testing & Development
- **Test Coverage**: Write tests for domain logic, validation, and edge cases
- **Domain Testing**: Test business rules separately from API integration
- **Error Handling**: Test both success and failure scenarios
- **Build Verification**: Always run `npm run build` and `npm run lint` before commits

### Client Package Patterns
- **Entity vs Value Object**: Use Entity for objects with identity, Value Object for data structures
- **API Integration**: Implement consistent `fromAPI()`, `toAPI()`, and `validate()` methods
- **Type Generation**: Run `npm run generate:types` after OpenAPI spec changes
- **Business Logic**: Keep domain logic in models, not in HTTP client layer

## Development Notes

- All apps require **Node.js 21+**
- Use `make dev` for full development environment with all services
- API runs with debugging enabled in development mode
- **API Documentation**: Access Swagger UI at http://localhost:3000/api-docs during development
- Frontend supports hot module replacement via Vite
- Packages use tshy for dual ESM/CommonJS builds
- Redis Stack provides development database (no external dependencies)
- **Client Development**: Always run type generation before development (`npm run generate:types`)

## Common Client Development Workflows

### Working on Domain Models
```bash
cd packages/client
npm run generate:types  # Update types from OpenAPI
npm run dev             # Start watch mode
npm test               # Run tests continuously
```

### Before Committing Client Changes
```bash
npm run generate:types  # Ensure types are up to date
npm run build          # Verify TypeScript compilation
npm test               # Run all tests
npm run lint           # Check and fix code quality
```

### Debugging Domain Model Issues
- Check `src/generated/api-types.ts` for latest API schema
- Verify Zod schemas match OpenAPI specification
- Test domain validation separately from HTTP integration
- Use `validate()` methods to debug business rule failures