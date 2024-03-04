export class Data {
  static create({value}: {value: Buffer}) {
    return new Data(value)
  }

  constructor(public readonly value: Buffer) {}
}
