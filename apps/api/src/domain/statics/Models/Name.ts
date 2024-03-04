export class Name {
  static create({value}: {value: string}) {
    return new Name(value)
  }

  constructor(public readonly value: string) {}
}
