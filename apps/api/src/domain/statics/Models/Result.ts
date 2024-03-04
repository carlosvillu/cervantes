export class Result {
  static create({value}: {value: boolean}) {
    return new Result(value)
  }

  static success() {
    return new Result(true)
  }

  static failed() {
    return new Result(false)
  }

  isSuccess() {
    return this.value
  }

  constructor(public readonly value: boolean) {}
}
