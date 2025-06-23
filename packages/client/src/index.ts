/**
 * @cervantes/client - Official TypeScript client for Cervantes API
 *
 * Interactive book/story editor client that enables developers to integrate
 * choose-your-own-adventure style book creation in their applications.
 *
 * Built with Clean Architecture principles and full TypeScript support.
 */

// Main client export
export {CervantesClient} from './application/CervantesClient.js'

// Core types
export type {ClientConfig, UseCase, Repository, DomainError} from './domain/_kernel/types.js'

// Authentication types and enums
export {AuthState} from './application/auth/index.js'
export type {
  SignupAuthUseCaseInput,
  LoginAuthUseCaseInput,
  VerifyEmailAuthUseCaseInput,
  AuthStateChangeEvent,
  AuthStateChangeListener,
  TokenStorage,
  TokenManagerConfig
} from './application/auth/index.js'

// Book management types
export type {
  CreateBookUseCaseInput,
  FindByIDBookUseCaseInput,
  GetAllBooksUseCaseInput,
  UpdateBookUseCaseInput
} from './application/book/index.js'

// Body/Content management types
export type {
  CreateBodyUseCaseInput,
  FindByHashBodyUseCaseInput,
  FindByIDBodyUseCaseInput,
  GetAllBodiesUseCaseInput
} from './application/body/index.js'

// Chapter management types
export type {
  CreateChapterUseCaseInput,
  FindByIDChapterUseCaseInput,
  GetAllChaptersUseCaseInput,
  UpdateChapterUseCaseInput,
  DeleteChapterUseCaseInput
} from './application/chapter/index.js'

// User management types
export type {GetCurrentUserUseCaseInput, GetCurrentUserUseCaseOutput} from './application/user/index.js'

// Domain models (for advanced usage)
export type {AuthTokens} from './domain/auth/AuthTokens.js'
export type {SuccessMessage} from './domain/_shared/SuccessMessage.js'
export type {ValidationToken} from './domain/auth/ValidationToken.js'
export type {Book, BookStatus, BookMetadata, BookValidation, BookPermissions} from './domain/book/types.js'
export type {Body, CreateBodyRequest, BodyRepository} from './domain/body/types.js'
export type {
  Chapter,
  ChapterMetadata,
  ChapterValidation,
  ChapterPermissions,
  ChapterRepository
} from './domain/chapter/types.js'
export type {
  User,
  UserAction,
  UserProfile,
  UserValidation,
  UserPermissions,
  UserRepository
} from './domain/user/types.js'

// Storage adapters (for custom configurations)
export {LocalStorageAdapter, SessionStorageAdapter} from './infrastructure/storage/index.js'

// Version info
export const VERSION = '0.1.0'
