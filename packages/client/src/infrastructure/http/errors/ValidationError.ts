import {DomainError} from '../../../domain/_kernel/types.js'

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR'
  readonly statusCode = 400

  constructor(message: string, cause?: Error) {
    super(message, cause)
    this.name = 'ValidationError'
  }

  static create(message: string, cause?: Error): ValidationError {
    return new ValidationError(message, cause)
  }

  static fromResponse(response: Response, validationErrors?: string[]): ValidationError {
    const baseMessage = 'Request validation failed'
    const errorDetails = validationErrors?.length ? `: ${validationErrors.join(', ')}` : ''

    return new ValidationError(
      `${baseMessage}${errorDetails}`,
      new Error(`HTTP ${response.status}: ${response.statusText}`)
    )
  }

  static fromZodError(error: Error): ValidationError {
    return new ValidationError(`Response validation failed: ${error.message}`, error)
  }
}
