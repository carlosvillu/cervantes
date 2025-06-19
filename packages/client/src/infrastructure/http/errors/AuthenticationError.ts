import {DomainError} from '../../../domain/_kernel/types.js'

export class AuthenticationError extends DomainError {
  readonly code = 'AUTHENTICATION_ERROR'
  readonly statusCode: number

  constructor(message: string, statusCode: number, cause?: Error) {
    super(message, cause)
    this.name = 'AuthenticationError'
    this.statusCode = statusCode
  }

  static create(message: string, statusCode: number, cause?: Error): AuthenticationError {
    return new AuthenticationError(message, statusCode, cause)
  }

  static fromResponse(response: Response): AuthenticationError {
    const message = response.status === 401 ? 'Authentication required' : 'Access forbidden'

    return new AuthenticationError(
      `${message}: ${response.statusText}`,
      response.status,
      new Error(`HTTP ${response.status}`)
    )
  }
}
