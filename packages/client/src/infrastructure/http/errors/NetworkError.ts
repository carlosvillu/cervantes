import {DomainError} from '../../../domain/_kernel/types.js'

export class NetworkError extends DomainError {
  readonly code = 'NETWORK_ERROR'
  readonly statusCode = 0

  constructor(message: string, cause?: Error) {
    super(message, cause)
    this.name = 'NetworkError'
  }

  static create(message: string, cause?: Error): NetworkError {
    return new NetworkError(message, cause)
  }

  static fromFetchError(error: Error): NetworkError {
    return new NetworkError(`Network request failed: ${error.message}`, error)
  }
}
