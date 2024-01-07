import bcrypt from 'bcrypt'

import {Password} from './Password.js'

export class PlainPassword {
  static create({value}: {value: string}) {
    return new PlainPassword(value)
  }

  constructor(public readonly value: string) {}

  async equals(password: Password): Promise<boolean> {
    return bcrypt.compare(this.value, password.value)
  }
}
