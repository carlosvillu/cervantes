import {ErrorCodes} from './ErrorCodes'

export class DomainError extends AggregateError {
  static create(errors: Error[], name?: string) {
    return new DomainError(errors, name)
  }

  has(error: ErrorCodes) {
    return this.errors.find(e => e.message === error)
  }

  toJSON() {
    return {error: true, errors: this.errors.map(error => error.message), name: this.message}
  }
}
