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
- **Packages**: `/packages/decorators` (shared utilities), `/packages/literals` (shared types)
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

### Development Services
Docker Compose provides:
- **Redis Stack**: Primary database and caching
- **Fooocus AI**: Image generation service
- **DS Service**: Additional service on port 3002

## Key Implementation Details

### Shared Domain Logic
Frontend and backend share similar domain structures for consistency. Repository implementations vary by environment:
- **API**: Redis-based repositories
- **Editor**: HTTP repositories for API calls + LocalStorage for offline

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

## Development Notes

- All apps require **Node.js 21+**
- Use `make dev` for full development environment with all services
- API runs with debugging enabled in development mode
- **API Documentation**: Access Swagger UI at http://localhost:3000/api-docs during development
- Frontend supports hot module replacement via Vite
- Packages use tshy for dual ESM/CommonJS builds
- Redis Stack provides development database (no external dependencies)