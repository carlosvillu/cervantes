import {AuthenticationError, ServerError, ValidationError} from '../errors/index.js'
import type {ResponseInterceptor} from '../types.js'

export class ErrorInterceptor {
  constructor(private readonly debug: boolean = false) {}

  getResponseInterceptor(): ResponseInterceptor {
    return (response: Response, data?: unknown): void => {
      if (this.debug) {
        console.log(`ErrorInterceptor: Response ${response.status} for ${response.url}`) // eslint-disable-line no-console
      }

      // Log error responses for debugging
      if (!response.ok && this.debug) {
        console.log(`ErrorInterceptor: Error response`, {
          // eslint-disable-line no-console
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          data
        })
      }
    }
  }

  static createErrorFromResponse(response: Response, data?: unknown): Error {
    const status = response.status

    // Authentication errors (401, 403)
    if (status === 401 || status === 403) {
      return AuthenticationError.fromResponse(response)
    }

    // Validation errors (400)
    if (status === 400) {
      const validationErrors = this.extractValidationErrors(data)
      return ValidationError.fromResponse(response, validationErrors)
    }

    // Client errors (other 4xx)
    if (status >= 400 && status < 500) {
      return ValidationError.fromResponse(response)
    }

    // Server errors (5xx)
    if (status >= 500) {
      return ServerError.fromResponse(response)
    }

    // Fallback for unexpected status codes
    return new Error(`Unexpected HTTP status: ${status} ${response.statusText}`)
  }

  private static extractValidationErrors(data: unknown): string[] | undefined {
    // Try to extract validation error messages from response data
    if (typeof data === 'object' && data !== null) {
      const errorData = data as Record<string, unknown>

      // Common patterns for validation errors
      if (Array.isArray(errorData.errors)) {
        return errorData.errors.filter((error): error is string => typeof error === 'string')
      }

      if (typeof errorData.message === 'string') {
        return [errorData.message]
      }

      if (Array.isArray(errorData.messages)) {
        return errorData.messages.filter((msg): msg is string => typeof msg === 'string')
      }
    }

    return undefined
  }
}
