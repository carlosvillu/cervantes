export class Token {
  static create({value}: {value: string}) {
    return new Token(value)
  }

  constructor(public readonly value: string) {}
}
