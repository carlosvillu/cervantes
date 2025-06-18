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

// Version info
export const VERSION = '0.1.0'
