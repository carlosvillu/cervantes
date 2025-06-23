# Cervantes 📚

**Interactive Storytelling Platform for Choose-Your-Own-Adventure Books**

Cervantes is a comprehensive web application that empowers authors to create immersive, interactive narratives with branching storylines. Built with modern web technologies, it combines the art of storytelling with the power of choice-driven narratives, allowing readers to shape their own adventure.

## 🎯 What is Cervantes?

Cervantes transforms traditional linear storytelling into **interactive experiences** where readers make choices that determine the story's direction. Authors can create complex, branching narratives with multiple paths, endings, and outcomes - perfect for choose-your-own-adventure books, interactive fiction, educational scenarios, and text-based games.

### Key Concepts

- **Books**: Interactive story collections with AI-generated covers
- **Chapters**: Story segments with rich text content
- **Links**: Connections between chapters enabling story branching
  - **Options**: Reader choices with custom text ("Go left", "Open the door")  
  - **Direct**: Automatic continuation to next chapter
- **Visual Story Mapping**: Drag-and-drop interface for managing complex narratives
- **AI-Powered Content**: Automatic cover generation for books and chapters

## ✨ Features

### 🖋️ Content Creation
- **Rich Text Editor**: Powered by TipTap/ProseMirror for professional formatting
- **Real-time Auto-saving**: Never lose your work with automatic content saving
- **Version Control**: Hash-based content versioning with change tracking
- **AI Cover Generation**: Automatic book and chapter cover creation via Fooocus
- **File Uploads**: Support for custom images via AWS S3 integration

### 🗺️ Story Flow Management
- **Visual Story Mapping**: Interactive flowchart using ReactFlow with drag-and-drop
- **Branching Narratives**: Create complex story trees with multiple paths
- **Choice Management**: Define reader options and story continuations
- **Root Chapter System**: Organize story entry points and flow control

### 📱 Reading Experience
- **Mobile-Optimized**: Immersive reading interface designed for mobile devices
- **Smooth Navigation**: Seamless transitions between story chapters
- **Choice-Based Progression**: Intuitive selection of story paths
- **Offline Reading**: Local caching for uninterrupted experience

### 👥 User Management
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Email Verification**: Resend integration for account validation
- **Draft/Published Workflow**: Control book visibility and publication status

## 🎯 Use Cases & Target Audience

### Perfect For
- **Interactive Fiction Writers**: Authors creating branching narratives
- **Game Developers**: Text-based adventure and gamebook creators
- **Educators**: Interactive learning scenarios and training simulations
- **Creative Writers**: Experimental non-linear storytelling projects
- **Publishers**: Interactive fiction and educational content

### Application Scenarios
- Choose-your-own-adventure books
- Educational decision-making scenarios
- Corporate training simulations
- Interactive learning materials
- Text-based narrative games
- Creative writing workshops

## 🏗️ Technical Architecture

### Technology Stack

#### Backend (API)
- **Runtime**: Node.js 21 with ES Modules
- **Framework**: Express.js with TypeScript
- **Database**: Redis with Redis-OM for data modeling
- **Authentication**: JWT tokens with bcrypt encryption
- **Email**: Resend for verification and notifications
- **Storage**: AWS S3 for file uploads
- **AI Integration**: Fooocus service for image generation

#### Frontend (Editor)
- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: TailwindCSS 3 with HeadlessUI components
- **Rich Text**: TipTap editor (ProseMirror-based)
- **Flow Diagrams**: ReactFlow with Dagre for story visualization
- **Offline Support**: LocalForage for client-side storage
- **Routing**: React Router for navigation

#### TypeScript Client Package (`packages/client`)
- **Architecture**: Clean Architecture with Domain-Driven Design
- **Authentication**: Complete JWT workflow with auto-refresh
- **API Coverage**: Auth, Books, Chapters, Content versioning
- **Type Safety**: Auto-generated types from OpenAPI specification
- **Testing**: 161 tests with comprehensive coverage
- **Build System**: Dual ESM/CommonJS support with tshy
- **Validation**: Zod schemas for runtime type validation

#### Development Infrastructure
- **Containerization**: Docker Compose for development services
- **Monorepo**: npm workspaces with ultra-runner
- **Build Tools**: Vite for frontend, tsx for backend development
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

### Architecture Patterns

#### Clean Architecture
Both API and Editor follow Clean Architecture principles:

1. **Domain Layer**: Business logic and models
   - Use Cases with standardized `UseCase<Input, Output>` interface
   - Repository pattern with multiple implementations
   - Domain models with strong typing

2. **Infrastructure Layer**: External services integration
   - Redis repositories for data persistence
   - HTTP repositories for API communication
   - LocalStorage repositories for offline support

3. **Application Layer**: Controllers and UI components
   - Express route handlers and middleware
   - React components and pages
   - Clean separation of concerns

#### Domain-Driven Design
Organized around business domains:
- **Auth**: Authentication and authorization
- **User**: User management and verification
- **Book**: Book creation and management
- **Chapter**: Content management and versioning
- **Link**: Story flow and chapter relationships
- **Body**: Content versioning with hash-based storage
- **Image**: AI-generated covers and file uploads
- **Statics**: File management and AWS S3 integration

## 📚 API Documentation

Cervantes provides a comprehensive REST API documented with OpenAPI 3.0 specification. The API enables full programmatic access to all platform features including authentication, content management, and AI services.

### Interactive API Documentation

Access the **Swagger UI** documentation when running the development server:

- **Local Development**: http://localhost:3000/api-docs
- **Production**: https://api.bookadventur.es/api-docs

The interactive documentation provides:
- **Complete API Reference**: All endpoints with request/response schemas
- **Authentication Testing**: Built-in JWT token management
- **Try It Out**: Execute API calls directly from the browser
- **Code Examples**: Auto-generated code samples in multiple languages

### API Features

#### Authentication & Security
- **JWT Bearer Authentication**: Secure token-based authentication
- **Email Verification**: Account validation workflow
- **Token Refresh**: Automatic session management

#### Content Management
- **Books**: Create, update, and manage interactive story collections
- **Chapters**: Rich text content with versioning support
- **Links**: Define story branching and reader choices
- **Bodies**: Hash-based content versioning system

#### Media & AI Services
- **Image Generation**: AI-powered cover creation via Fooocus
- **File Uploads**: Direct S3 integration for custom media
- **Rate Limiting**: 10 requests/hour for AI generation per user

#### Data Formats
- **Request/Response**: JSON with comprehensive validation
- **File Uploads**: Multipart form data for images
- **Error Handling**: Standardized error responses with details

### Production API

The production API is available at:
```
https://api.bookadventur.es
```

All endpoints require authentication except for signup, login, and token refresh operations.

## 📦 TypeScript Client Library

Cervantes provides an official TypeScript client library for seamless API integration:

### Features
- **🔐 Complete Authentication**: Signup, login, token management with automatic refresh
- **📚 Content Management**: Full CRUD operations for books, chapters, and content
- **🎯 Type Safety**: Auto-generated types from OpenAPI specification
- **🏗️ Clean Architecture**: Domain models with UseCase patterns
- **✅ Well Tested**: 161 comprehensive tests with high coverage
- **📦 Modern Build**: Dual ESM/CommonJS support

### Installation
```bash
npm install @cervantes/client
```

### Quick Start
```typescript
import { CervantesClient } from '@cervantes/client'

const client = new CervantesClient({
  baseURL: 'https://api.bookadventur.es'
})

// Authenticate
const tokens = await client.auth.login({
  email: 'author@example.com',
  password: 'secure-password'
})

// Create a book
const book = await client.books.create({
  title: 'My Interactive Story',
  summary: 'An amazing adventure awaits...'
})

// Add chapters
const chapter = await client.chapters.create({
  bookID: book.id,
  title: 'The Beginning',
  summary: 'Our story starts here...'
})
```

### Available Services
- **🔑 AuthService**: Authentication and user management
- **📖 BookService**: Interactive book creation and management
- **📝 ChapterService**: Chapter content and structure management
- **📄 BodyService**: Content versioning and hash-based storage

## 🚀 Quick Start

### Prerequisites
- **Node.js 21+** (required for ES modules and latest features)
- **Docker & Docker Compose** (for development services)
- **Git** (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/carlosvillu/cervantes.git
   cd cervantes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development environment**
   ```bash
   make dev
   ```
   This command starts:
   - Redis Stack (database)
   - Fooocus AI service (image generation)
   - API server (backend)
   - Editor (frontend)

4. **Access the application**
   - **Editor**: http://localhost:3001
   - **API**: http://localhost:3000
   - **API Documentation**: http://localhost:3000/api-docs
   - **AI Service**: http://localhost:3002

### Development Commands

```bash
# Full development environment
make dev                 # Start all services (Docker + API + Editor)
make build_dev          # Build packages then start development
make compose_dev        # Start only Docker services

# Individual services
cd apps/api && npm run dev      # API development server
cd apps/editor && npm run dev   # Editor development server

# Utility commands
make clean              # Remove build artifacts
make phoenix           # Clean reinstall dependencies
```

## 📖 Usage Guide

### Creating Your First Interactive Book

1. **Sign Up & Verify Email**
   - Create account and verify via email
   - Access the editor dashboard

2. **Create a New Book**
   - Click "New Book" and add title, summary
   - Generate an AI cover or upload custom image

3. **Write Your First Chapter**
   - Create root chapter with story introduction
   - Use rich text editor for formatting
   - Add chapter cover if desired

4. **Build Story Flow**
   - Use visual story map to see chapter relationships
   - Create links between chapters
   - Add choice options with custom text

5. **Test Your Story**
   - Use preview mode to test story flow
   - Verify all links work correctly
   - Test on mobile devices

6. **Publish**
   - Set book status to "Published"
   - Share with readers

### Advanced Features

#### Link Types
- **Option Links**: Present choices to readers
- **Direct Links**: Automatic chapter progression

#### Content Management
- **Auto-save**: Content saves automatically
- **Version Control**: Track content changes
- **Offline Support**: Work without internet

#### AI Integration
- **Cover Generation**: Create book/chapter covers
- **Prompt Customization**: Tailor AI-generated content

## 🚢 Deployment

### API Deployment (Fly.io)
```bash
make deploy_api
```

### Editor Deployment (Fly.io)
```bash
make deploy_editor
```

### Environment Variables
Configure the following for production:

#### API (.env.production)
```env
NODE_ENV=production
PORT=3000
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
RESEND_API_KEY=your-resend-key
FOOOCUS_API_URL=http://localhost:3002
```

#### Editor
```env
VITE_API_URL=https://your-api-domain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow code style**: ESLint and Prettier configurations
4. **Add tests**: Ensure new features have appropriate tests
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**

### Development Guidelines
- Follow Clean Architecture principles
- Use TypeScript for type safety
- Write unit tests for use cases
- Document complex business logic
- Maintain consistent code style

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **TipTap**: Rich text editing capabilities
- **ReactFlow**: Visual story mapping
- **Fooocus**: AI image generation
- **Redis**: High-performance data storage
- **Tailwind CSS**: Beautiful UI components

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/carlosvillu/cervantes/issues)
- **Discussions**: [GitHub Discussions](https://github.com/carlosvillu/cervantes/discussions)
- **Documentation**: [Project Wiki](https://github.com/carlosvillu/cervantes/wiki)

---

**Built with ❤️ for interactive storytelling**

*Cervantes - Where stories come alive through choice*