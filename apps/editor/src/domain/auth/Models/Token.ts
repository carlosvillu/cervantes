export class Token {
  static create({value}: {value: string}) {
    return new Token(value)
  }

  static sixDigitRandom() {
    return new Token(String(Math.floor(100000 + Math.random() * 9000)))
  }

  constructor(public readonly value: string) {}
}
