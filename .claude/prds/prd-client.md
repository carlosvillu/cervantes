# PRD: Cliente Oficial TypeScript para Cervantes API

## 📋 Resumen Ejecutivo

### Objetivos del Proyecto
Desarrollar un cliente oficial en TypeScript para la API de Cervantes que permita a desarrolladores integrar fácilmente las funcionalidades de creación de libros interactivos en sus aplicaciones. El cliente seguirá los principios de Clean Architecture utilizados en el proyecto y proporcionará una interfaz typesafe para todos los endpoints disponibles.

### Contexto y Motivación
Actualmente, Cervantes cuenta con:
- **API Backend**: 47 endpoints organizados en 8 módulos principales
- **Editor Frontend**: Implementación React con repositorios HTTP
- **Arquitectura Clean**: Patrón UseCase/Repository establecido

La creación de un cliente oficial permitirá:
- Facilitar la integración de terceros
- Reutilizar la lógica de dominio existente
- Mantener consistencia en el ecosistema Cervantes
- Acelerar el desarrollo de nuevas aplicaciones

### Métricas de Éxito
- **Cobertura de API**: 100% de endpoints implementados
- **Type Safety**: Zero errores de TypeScript en build
- **Testing**: >90% cobertura de código
- **Bundle Size**: <100KB minificado
- **Developer Experience**: Documentación completa + ejemplos

---

## 🏗️ Análisis de la API Existente

### Módulos Principales (8 categorías)

#### 1. **Authentication** (6 endpoints)
- `POST /auth/signup` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh` - Renovar tokens
- `DELETE /auth/refresh` - Logout
- `POST /auth/validationToken` - Enviar código validación
- `POST /auth/validationToken/{id}` - Verificar email

#### 2. **User Management** (1 endpoint)
- `GET /user/current` - Obtener usuario actual

#### 3. **Book Management** (4 endpoints)
- `POST /book` - Crear libro
- `GET /book` - Listar libros del usuario
- `GET /book/{bookID}` - Obtener libro específico
- `PUT /book/{bookID}` - Actualizar libro

#### 4. **Chapter Management** (5 endpoints)
- `POST /chapter` - Crear capítulo
- `GET /chapter` - Listar capítulos por libro
- `GET /chapter/{chapterID}` - Obtener capítulo específico
- `PUT /chapter/{chapterID}` - Actualizar capítulo
- `DELETE /chapter/{chapterID}` - Eliminar capítulo

#### 5. **Link Management** (4 endpoints)
- `POST /link` - Crear enlace entre capítulos
- `GET /link` - Obtener enlaces desde capítulo
- `GET /link/{linkID}` - Obtener enlace específico
- `DELETE /link/{linkID}` - Eliminar enlace

#### 6. **Content Management** (4 endpoints)
- `POST /body` - Crear contenido versionado
- `GET /body` - Obtener contenido por hash/capítulo
- `GET /body/{bodyID}` - Obtener contenido específico

#### 7. **Image Management** (8 endpoints)
- `GET /image/bookcover` - Obtener portada libro
- `POST /image/bookcover` - Establecer portada libro
- `DELETE /image/bookcover` - Eliminar portada libro
- `GET /image/chaptercover` - Obtener portada capítulo
- `POST /image/chaptercover` - Establecer portada capítulo
- `DELETE /image/chaptercover` - Eliminar portada capítulo
- `POST /image/generate` - Generar imágenes con IA

#### 8. **Upload Management** (1 endpoint)
- `POST /upload/image` - Subir archivo de imagen

### Modelos de Datos Principales (16 schemas)

**Core Entities:**
- `User` - Usuario del sistema
- `Book` - Libro/Historia principal
- `Chapter` - Capítulo dentro de un libro
- `Link` - Conexión entre capítulos
- `Body` - Contenido versionado de capítulos

**Media & Assets:**
- `BookCover` - Portada de libro
- `ChapterCover` - Portada de capítulo
- `GenerateImageRequest/Response` - Generación IA

**Authentication:**
- `AuthTokens` - Tokens de acceso/refresh
- `ValidationToken` - Validación de email
- `SignupRequest` - Datos de registro
- `LoginRequest` - Datos de login

---

## 🎯 Arquitectura del Cliente TypeScript

### Principios de Diseño

#### 1. **Clean Architecture**
Seguir el patrón establecido en el proyecto existente:
```
src/
├── domain/           # Lógica de negocio
│   ├── _kernel/      # Primitivos compartidos
│   ├── auth/        # Módulo autenticación
│   ├── book/        # Módulo libros
│   ├── chapter/     # Módulo capítulos
│   └── ...
├── infrastructure/   # Implementaciones concretas
│   ├── http/        # Cliente HTTP
│   ├── storage/     # Almacenamiento local
│   └── cache/       # Sistema de caché
└── application/      # Casos de uso públicos
    └── CervantesClient.ts
```

#### 2. **Type Safety First**
- Generación automática de tipos desde OpenAPI
- Validación de esquemas en runtime
- Error handling tipado por módulo

#### 3. **Repository Pattern**
Interfaces abstractas con múltiples implementaciones:
- `HTTPRepository` - Cliente HTTP principal
- `CachedRepository` - Con capa de caché
- `OfflineRepository` - Soporte offline

#### 4. **UseCase Pattern**
Cada operación encapsulada en UseCase específico:
```typescript
interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>
}
```

### Stack Tecnológico

**Core Dependencies:**
- **TypeScript** 5+ - Type safety y desarrollo
- **Fetch API** - HTTP client (con polyfill para Node)
- **Zod** - Validación de esquemas runtime
- **openapi-typescript** - Generación de tipos

**Development & Build:**
- **tshy** - Dual package (ESM/CommonJS)
- **Vitest** - Testing framework
- **Rollup** - Bundle optimization
- **TypeDoc** - Documentación automática

**Optional Integrations:**
- **LocalForage** - Offline storage
- **SWR/TanStack Query** - Data fetching (helpers)

---

## 📅 Plan de Desarrollo - 5 Fases

## **FASE 1: Foundation & Authentication** 
*Tiempo estimado: 2-3 semanas*

- [ ] **FASE 1 COMPLETA**

### **Objetivos de la Fase**
Establecer la base del cliente con autenticación funcional y arquitectura core.

### **Tareas Principales**

#### **1.1 Configuración del Proyecto**
- [x] **1.1** Configuración del Proyecto
  - [x] **1.1.1** Inicializar proyecto TypeScript con tshy
  - [x] **1.1.2** Configurar herramientas de desarrollo (ESLint, Prettier, Vitest)
  - [x] **1.1.3** Configurar CI/CD pipeline (GitHub Actions)
  - [x] **1.1.4** Establecer estructura de directorios Clean Architecture

#### **1.2 Generación de Tipos y Domain Models**
- [x] **1.2** Generación de Tipos y Domain Models ✅ **COMPLETADO**
  - [x] **1.2.1** Integrar openapi-typescript con openapi.yaml
  - [x] **1.2.2** Generar tipos automáticos para todos los schemas
  - [x] **1.2.3** Crear script de regeneración de tipos
  - [x] **1.2.4** Validar tipos generados con casos de test
  - [x] **1.2.5** Implementar 25 domain models con Clean Architecture
  - [x] **1.2.6** Crear Entity/ValueObject patterns con validación Zod
  - [x] **1.2.7** Implementar fromAPI/toAPI methods para serialización
  - [x] **1.2.8** Establecer shared validation utilities
  - [x] **1.2.9** Aplicar security fixes y code quality improvements

#### **1.3 HTTP Client Foundation**
- [x] **1.3** HTTP Client Foundation ✅ **COMPLETADO**
  - [x] **1.3.1** Implementar HTTPClient base con Fetch API
  - [x] **1.3.2** Configurar interceptors para auth headers
  - [x] **1.3.3** Implementar error handling estándar
  - [x] **1.3.4** Crear retry logic para requests fallidos

#### **1.4 Módulo Authentication**
- [ ] **1.4** Módulo Authentication
  - [ ] **1.4.1** Implementar AuthRepository interface
  - [ ] **1.4.2** Crear HTTPAuthRepository implementation
  - [ ] **1.4.3** Desarrollar AuthUseCases:
    - [ ] `SignupAuthUseCase`
    - [ ] `LoginAuthUseCase`
    - [ ] `RefreshTokenAuthUseCase`
    - [ ] `LogoutAuthUseCase`
    - [ ] `SendValidationCodeAuthUseCase`
    - [ ] `VerifyEmailAuthUseCase`
  - [ ] **1.4.4** Implementar TokenManager para gestión de tokens
  - [ ] **1.4.5** Crear AuthService público

### **Criterios de Aceptación Fase 1**
- ✅ Autenticación completa funcional (signup, login, refresh, logout)
- ✅ Gestión automática de tokens JWT
- ✅ Manejo de errores tipado por endpoint
- ✅ 100% cobertura de tests para módulo auth
- ✅ Documentación de APIs públicas

### **Entregables**
- Paquete NPM publicable básico
- Documentación de instalación y configuración
- Ejemplos de uso de autenticación
- Suite de tests automatizados

---

## **FASE 2: Content Management Core**
*Tiempo estimado: 3-4 semanas*

- [ ] **FASE 2 COMPLETA**

### **Objetivos de la Fase**
Implementar gestión completa de libros, capítulos y contenido versionado.

### **Tareas Principales**

#### **2.1 Módulo Book Management**
- [ ] **2.1** Módulo Book Management
  - [ ] **2.1.1** Implementar BookRepository interface
  - [ ] **2.1.2** Crear HTTPBookRepository implementation
  - [ ] **2.1.3** Desarrollar BookUseCases:
    - [ ] `CreateBookUseCase`
    - [ ] `FindByIDBookUseCase`
    - [ ] `GetAllBooksUseCase`
    - [ ] `UpdateBookUseCase`
  - [ ] **2.1.4** Crear BookService público
  - [ ] **2.1.5** Implementar validaciones de negocio para Book

#### **2.2 Módulo Chapter Management**
- [ ] **2.2** Módulo Chapter Management
  - [ ] **2.2.1** Implementar ChapterRepository interface
  - [ ] **2.2.2** Crear HTTPChapterRepository implementation
  - [ ] **2.2.3** Desarrollar ChapterUseCases:
    - [ ] `CreateChapterUseCase`
    - [ ] `FindByIDChapterUseCase`
    - [ ] `GetAllChaptersUseCase`
    - [ ] `UpdateChapterUseCase`
    - [ ] `DeleteChapterUseCase`
  - [ ] **2.2.4** Crear ChapterService público
  - [ ] **2.2.5** Implementar relaciones Book-Chapter

#### **2.3 Módulo Body/Content Management**
- [ ] **2.3** Módulo Body/Content Management
  - [ ] **2.3.1** Implementar BodyRepository interface
  - [ ] **2.3.2** Crear HTTPBodyRepository implementation
  - [ ] **2.3.3** Desarrollar BodyUseCases:
    - [ ] `CreateBodyUseCase`
    - [ ] `FindByHashBodyUseCase`
    - [ ] `FindByIDBodyUseCase`
    - [ ] `GetAllBodiesUseCase`
  - [ ] **2.3.4** Implementar sistema de versionado por hash
  - [ ] **2.3.5** Crear BodyService público

#### **2.4 User Management**
- [ ] **2.4** User Management
  - [ ] **2.4.1** Implementar UserRepository interface
  - [ ] **2.4.2** Crear HTTPUserRepository implementation
  - [ ] **2.4.3** Desarrollar UserUseCases:
    - [ ] `GetCurrentUserUseCase`
  - [ ] **2.4.4** Crear UserService público

### **Criterios de Aceptación Fase 2**
- ✅ CRUD completo para Books y Chapters
- ✅ Sistema de versionado de contenido funcional
- ✅ Validaciones de negocio implementadas
- ✅ Relaciones entre entidades respetadas
- ✅ 100% cobertura de tests para módulos core

### **Entregables**
- API completa para gestión de contenido
- Documentación de workflows de creación
- Ejemplos de creación de libros interactivos
- Tests de integración end-to-end

---

## **FASE 3: Interactive Features & Links**
*Tiempo estimado: 2-3 semanas*

- [ ] **FASE 3 COMPLETA**

### **Objetivos de la Fase**
Implementar sistema de enlaces entre capítulos para narrativas interactivas.

### **Tareas Principales**

#### **3.1 Módulo Link Management**
- [ ] **3.1** Módulo Link Management
  - [ ] **3.1.1** Implementar LinkRepository interface
  - [ ] **3.1.2** Crear HTTPLinkRepository implementation
  - [ ] **3.1.3** Desarrollar LinkUseCases:
    - [ ] `CreateLinkUseCase`
    - [ ] `FindByIDLinkUseCase`
    - [ ] `GetLinksFromChapterUseCase`
    - [ ] `DeleteLinkUseCase`
  - [ ] **3.1.4** Crear LinkService público
  - [ ] **3.1.5** Implementar validaciones de links (evitar ciclos infinitos)

#### **3.2 Flow Management & Validation**
- [ ] **3.2** Flow Management & Validation
  - [ ] **3.2.1** Crear FlowValidator para estructura de libro
  - [ ] **3.2.2** Implementar detección de capítulos huérfanos
  - [ ] **3.2.3** Crear algoritmo de validación de flujos
  - [ ] **3.2.4** Implementar sugerencias de estructura

#### **3.3 Navigation Helpers**
- [ ] **3.3** Navigation Helpers
  - [ ] **3.3.1** Crear NavigationService para traversal de libros
  - [ ] **3.3.2** Implementar BookFlowMapper para visualización
  - [ ] **3.3.3** Crear utilidades de análisis de estructura
  - [ ] **3.3.4** Implementar BookExporter para diferentes formatos

### **Criterios de Aceptación Fase 3**
- ✅ Sistema de enlaces funcional con validaciones
- ✅ Prevención de estructuras inválidas
- ✅ Herramientas de análisis de flujo
- ✅ Navegación programática por libros
- ✅ Tests para casos edge de links complejos

### **Entregables**
- API completa de gestión de enlaces
- Herramientas de validación de estructura
- Utilidades de navegación y análisis
- Documentación de mejores prácticas

---

## **FASE 4: Media & AI Integration**
*Tiempo estimado: 2-3 semanas*

- [ ] **FASE 4 COMPLETA**

### **Objetivos de la Fase**
Integrar gestión de imágenes, portadas y generación con IA.

### **Tareas Principales**

#### **4.1 Módulo Image Management**
- [ ] **4.1** Módulo Image Management
  - [ ] **4.1.1** Implementar ImageRepository interface
  - [ ] **4.1.2** Crear HTTPImageRepository implementation
  - [ ] **4.1.3** Desarrollar ImageUseCases:
    - [ ] `CreateBookCoverUseCase`
    - [ ] `CreateChapterCoverUseCase`
    - [ ] `FindBookCoverUseCase`
    - [ ] `FindChapterCoverUseCase`
    - [ ] `DeleteBookCoverUseCase`
    - [ ] `DeleteChapterCoverUseCase`
  - [ ] **4.1.4** Crear ImageService público

#### **4.2 AI Image Generation**
- [ ] **4.2** AI Image Generation
  - [ ] **4.2.1** Implementar GenerateImageUseCase
  - [ ] **4.2.2** Crear AIImageService con rate limiting
  - [ ] **4.2.3** Implementar queue system para generación
  - [ ] **4.2.4** Crear prompt helpers y templates

#### **4.3 Módulo Upload Management**
- [ ] **4.3** Módulo Upload Management
  - [ ] **4.3.1** Implementar StaticsRepository interface
  - [ ] **4.3.2** Crear HTTPStaticsRepository implementation
  - [ ] **4.3.3** Desarrollar UploadUseCases:
    - [ ] `UploadImageUseCase`
  - [ ] **4.3.4** Crear UploadService con validaciones
  - [ ] **4.3.5** Implementar progress tracking para uploads

#### **4.4 Media Optimization**
- [ ] **4.4** Media Optimization
  - [ ] **4.4.1** Crear ImageProcessor para optimización
  - [ ] **4.4.2** Implementar resize y compression helpers
  - [ ] **4.4.3** Crear CDN integration helpers
  - [ ] **4.4.4** Implementar lazy loading utilities

### **Criterios de Aceptación Fase 4**
- ✅ Gestión completa de imágenes y portadas
- ✅ Integración funcional con IA (Fooocus)
- ✅ Sistema de uploads robusto
- ✅ Rate limiting respetado (10 requests/hour)
- ✅ Optimización automática de imágenes

### **Entregables**
- API completa de gestión de media
- Integración con servicios de IA
- Herramientas de optimización de imágenes
- Documentación de límites y mejores prácticas

---

## **FASE 5: Advanced Features & Production**
*Tiempo estimado: 3-4 semanas*

- [ ] **FASE 5 COMPLETA**

### **Objetivos de la Fase**
Funcionalidades avanzadas, optimización y preparación para producción.

### **Tareas Principales**

#### **5.1 Offline & Caching**
- [ ] **5.1** Offline & Caching
  - [ ] **5.1.1** Implementar CacheRepository interface
  - [ ] **5.1.2** Crear LocalStorageRepository implementations
  - [ ] **5.1.3** Implementar sync strategies (offline-first)
  - [ ] **5.1.4** Crear CacheManager con TTL y invalidation
  - [ ] **5.1.5** Implementar conflict resolution para sync

#### **5.2 Real-time Features**
- [ ] **5.2** Real-time Features
  - [ ] **5.2.1** Integrar WebSocket client para updates
  - [ ] **5.2.2** Implementar EventEmitter para cambios
  - [ ] **5.2.3** Crear subscription system para entidades
  - [ ] **5.2.4** Implementar collaborative editing helpers

#### **5.3 Data Integration Helpers**
- [ ] **5.3** Data Integration Helpers
  - [ ] **5.3.1** Crear React hooks package (opcional)
  - [ ] **5.3.2** Implementar SWR/TanStack Query adapters
  - [ ] **5.3.3** Crear Vue composables (opcional)
  - [ ] **5.3.4** Implementar framework-agnostic observables

#### **5.4 Developer Experience**
- [ ] **5.4** Developer Experience
  - [ ] **5.4.1** Crear CLI tool para scaffolding
  - [ ] **5.4.2** Implementar debug mode con logging
  - [ ] **5.4.3** Crear migration helpers para schema changes
  - [ ] **5.4.4** Implementar telemetry opcionales

#### **5.5 Production Readiness**
- [ ] **5.5** Production Readiness
  - [ ] **5.5.1** Optimizar bundle size (tree-shaking)
  - [ ] **5.5.2** Implementar comprehensive error reporting
  - [ ] **5.5.3** Crear performance monitoring hooks
  - [ ] **5.5.4** Implementar security best practices audit

#### **5.6 Documentation & Examples**
- [ ] **5.6** Documentation & Examples
  - [ ] **5.6.1** Crear documentación completa (TypeDoc + manual)
  - [ ] **5.6.2** Desarrollar ejemplos de integración
  - [ ] **5.6.3** Crear starter templates para diferentes frameworks
  - [ ] **5.6.4** Implementar interactive playground

### **Criterios de Aceptación Fase 5**
- ✅ Soporte offline completo con sync
- ✅ Integración con frameworks populares
- ✅ Bundle optimizado (<100KB)
- ✅ Documentación completa y ejemplos
- ✅ Ready para producción con monitoreo

### **Entregables**
- Cliente completo con todas las funcionalidades
- Paquetes adicionales para frameworks
- Documentación exhaustiva
- Herramientas de desarrollo
- Templates y ejemplos de uso

---

## 🔧 Especificaciones Técnicas Detalladas

### **Estructura de Paquetes**

```
@cervantes/client/
├── core                 # Cliente principal
├── react               # React hooks y componentes
├── vue                 # Vue composables
├── cli                 # Herramientas CLI
└── examples            # Ejemplos y templates
```

### **APIs Públicas Principales**

#### **CervantesClient**
```typescript
class CervantesClient {
  constructor(config: ClientConfig)
  
  // Services
  auth: AuthService
  books: BookService
  chapters: ChapterService
  links: LinkService
  images: ImageService
  upload: UploadService
  users: UserService
  
  // Utilities
  navigation: NavigationService
  validation: ValidationService
  cache: CacheService
}
```

#### **Configuration**
```typescript
interface ClientConfig {
  baseURL?: string
  apiKey?: string
  timeout?: number
  retries?: number
  cache?: CacheConfig
  offline?: OfflineConfig
  debug?: boolean
}
```

### **Error Handling Strategy**

#### **Error Hierarchy**
```typescript
abstract class CervantesError extends Error {
  abstract code: ErrorCode
  abstract statusCode: number
}

class AuthenticationError extends CervantesError
class ValidationError extends CervantesError
class NetworkError extends CervantesError
class RateLimitError extends CervantesError
```

#### **Error Recovery**
- Automatic token refresh
- Request retry with exponential backoff
- Offline queue for failed requests
- User-friendly error messages

### **Testing Strategy**

#### **Unit Tests** (Vitest)
- 100% coverage para UseCases
- Mocking de repositories
- Validación de tipos y schemas

#### **Integration Tests**
- Tests contra API real (staging)
- End-to-end workflows
- Error scenarios

#### **Performance Tests**
- Bundle size monitoring
- Runtime performance benchmarks
- Memory usage profiling

---

## 📊 Métricas y KPIs

### **Métricas Técnicas**
- **Bundle Size**: <100KB minificado + gzip
- **API Coverage**: 100% endpoints implementados
- **Type Safety**: 0 errores TypeScript
- **Test Coverage**: >90% líneas de código
- **Performance**: <100ms tiempo de inicialización

### **Métricas de Calidad**
- **Documentation**: 100% APIs públicas documentadas
- **Examples**: >10 ejemplos de uso diferentes
- **Error Handling**: 100% errores API manejados
- **Offline Support**: Funcional para operaciones CRUD

### **Métricas de Adopción**
- **NPM Downloads**: Meta inicial 1000/mes
- **GitHub Stars**: Meta inicial 100 estrellas
- **Community Issues**: <24h respuesta inicial
- **Breaking Changes**: <1 por versión mayor

---

## 🚀 Plan de Lanzamiento

### **Pre-release (Alpha)**
- [ ] **Alpha Release**
  - [ ] Fases 1-3 completadas
  - [ ] API estable para core features
  - [ ] Documentación básica
  - [ ] Ejemplos fundamentales

### **Beta Release**
- [ ] **Beta Release**
  - [ ] Fases 1-4 completadas
  - [ ] Funcionalidades avanzadas
  - [ ] Tests comprehensivos
  - [ ] Feedback de early adopters

### **Production Release (v1.0)**
- [ ] **Production Release (v1.0)**
  - [ ] Todas las fases completadas
  - [ ] Documentación completa
  - [ ] Soporte oficial
  - [ ] Ecosystem packages listos

### **Post-Launch**
- [ ] **Post-Launch**
  - [ ] Community feedback integration
  - [ ] Performance optimizations
  - [ ] Additional framework integrations
  - [ ] Advanced developer tools

---

## 🤝 Consideraciones de Mantenimiento

### **Versionado**
- Semantic Versioning (SemVer)
- Automated changelog generation
- Deprecation policy clara
- Migration guides para breaking changes

### **Compatibilidad**
- Node.js 18+ support
- Modern browsers (ES2020+)
- TypeScript 4.5+ compatibility
- Framework version compatibility matrix

### **Monitoreo y Telemetría**
- Error tracking (opcional, opt-in)
- Usage analytics (anonymous)
- Performance monitoring
- API usage patterns

---

## 📋 Conclusión

Este PRD define el desarrollo completo de un cliente TypeScript oficial para la API de Cervantes, estructurado en 5 fases incrementales que permiten un desarrollo sistemático y validación continua.

**Tiempo total estimado**: 12-17 semanas
**Recursos necesarios**: 1-2 desarrolladores senior TypeScript
**Inversión aproximada**: 3-4 meses de desarrollo full-time

El resultado será un cliente robusto, type-safe y bien documentado que facilite la adopción de Cervantes por parte de la comunidad de desarrolladores, manteniendo los altos estándares de calidad y arquitectura del proyecto existente.