import bcrypt from 'bcrypt'

const {SALT} = process.env

export class Password {
  #hashed: boolean = false

  static create({value}: {value: string}) {
    return new Password(value, false)
  }

  static fromHashedPassword({value}: {value: string}) {
    return new Password(value, true)
  }

  constructor(private _value: string, hashed: boolean) {
    this.#hashed = hashed
  }

  async hash() {
    if (this.#hashed) return this

    const salt = await bcrypt.genSalt(+SALT)
    this._value = await bcrypt.hash(this._value, salt)
    this.#hashed = true
    return this
  }

  hasBeenHashed() {
    return this.#hashed
  }

  get value() {
    if (!this.#hashed) throw new Error(`[Password#value] Forbidden access to value w/out been hashed before`)

    return this._value
  }
}
