export class Email {
  static create({value}: {value: string}) {
    return new Email(value)
  }

  constructor(public readonly value: string) {}
}
