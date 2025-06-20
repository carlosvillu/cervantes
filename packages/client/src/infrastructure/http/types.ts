/**
 * HTTP client types and interfaces
 * Following the established patterns from the project's Fetcher interface
 */

import type {AnyZodObject, ZodArray} from 'zod'

// Request types
export interface HTTPRequestOptions {
  body?: FormData | Record<string, unknown>
  headers?: Record<string, string>
  timeout?: number
}

// Response tuple pattern following project conventions
export type HTTPResponse<T> = [Error | undefined, T | undefined]

// HTTP client interface following Fetcher pattern
export interface HTTPClient {
  get: <T>(
    url: string,
    options?: HTTPRequestOptions,
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ) => Promise<HTTPResponse<T>>
  post: <T>(
    url: string,
    options?: HTTPRequestOptions,
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ) => Promise<HTTPResponse<T>>
  put: <T>(
    url: string,
    options?: HTTPRequestOptions,
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ) => Promise<HTTPResponse<T>>
  delete: <T>(
    url: string,
    options?: HTTPRequestOptions,
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ) => Promise<HTTPResponse<T>>

  // Auth token management
  setAuthTokens: (accessToken: string, refreshToken: string) => void
  clearAuthTokens: () => void
  hasValidTokens: () => boolean
}

// Interceptor types
export type RequestInterceptor = (
  url: string,
  options: HTTPRequestOptions
) => Promise<HTTPRequestOptions> | HTTPRequestOptions

export type ResponseInterceptor = (response: Response, data?: unknown) => Promise<void> | void

// Retry configuration
export interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  retryCondition?: (error: Error, attempt: number) => boolean
}
