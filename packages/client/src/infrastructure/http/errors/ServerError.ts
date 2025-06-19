import {DomainError} from '../../../domain/_kernel/types.js'

export class ServerError extends DomainError {
  readonly code = 'SERVER_ERROR'
  readonly statusCode: number

  constructor(message: string, statusCode: number, cause?: Error) {
    super(message, cause)
    this.name = 'ServerError'
    this.statusCode = statusCode
  }

  static create(message: string, statusCode: number, cause?: Error): ServerError {
    return new ServerError(message, statusCode, cause)
  }

  static fromResponse(response: Response): ServerError {
    return new ServerError(
      `Server error: ${response.statusText}`,
      response.status,
      new Error(`HTTP ${response.status}`)
    )
  }

  isRetryable(): boolean {
    // 5xx errors are generally retryable, except 501 (Not Implemented)
    return this.statusCode >= 500 && this.statusCode !== 501
  }
}
