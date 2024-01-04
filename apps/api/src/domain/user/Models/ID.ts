export class ID {
  static create({value}: {value: string}) {
    return new ID(value)
  }

  constructor(public readonly value: string) {}
}
