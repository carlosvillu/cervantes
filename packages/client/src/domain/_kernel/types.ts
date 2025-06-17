/**
 * Core kernel types and interfaces for Cervantes Client
 * Following Clean Architecture patterns from the main project
 */

// Base domain primitives
export interface UseCase<Input = unknown, Output = unknown> {
  execute: (input: Input) => Promise<Output>
}

export interface Repository<Entity, ID = string> {
  findById: (id: ID) => Promise<Entity | null>
  save: (entity: Entity) => Promise<Entity>
  delete: (id: ID) => Promise<void>
}

// Base domain error
export abstract class DomainError extends Error {
  abstract readonly code: string
  abstract readonly statusCode: number

  constructor(message: string, public readonly cause?: Error) {
    super(message)
    this.name = this.constructor.name
  }
}

// Common value objects
export abstract class ValueObject<T> {
  constructor(protected readonly value: T) {}

  getValue(): T {
    return this.value
  }

  equals(other: ValueObject<T>): boolean {
    return this.value === other.value
  }
}

// Base entity
export abstract class Entity<ID = string> {
  constructor(protected readonly id: ID) {}

  getId(): ID {
    return this.id
  }

  equals(other: Entity<ID>): boolean {
    return this.id === other.id
  }
}

// Configuration types
export interface ClientConfig {
  baseURL?: string
  apiKey?: string
  timeout?: number
  retries?: number
  debug?: boolean
}
