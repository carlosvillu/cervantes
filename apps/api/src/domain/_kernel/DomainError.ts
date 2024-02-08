export class DomainError extends AggregateError {
  static create(errors: Error[], name?: string) {
    return new DomainError(errors, name)
  }

  toJSON() {
    return {error: true, errors: this.errors.map(error => error.message), name: this.message}
  }
}
