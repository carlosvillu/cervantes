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

// Domain models (for advanced usage)
export type {AuthTokens} from './domain/auth/AuthTokens.js'
export type {SuccessMessage} from './domain/_shared/SuccessMessage.js'
export type {ValidationToken} from './domain/auth/ValidationToken.js'

// Storage adapters (for custom configurations)
export {LocalStorageAdapter, SessionStorageAdapter} from './infrastructure/storage/index.js'

// Version info
export const VERSION = '0.1.0'
