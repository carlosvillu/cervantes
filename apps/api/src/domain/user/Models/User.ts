import {z} from 'zod'

const UserValidations = z.object({
  id: z.string({required_error: 'ID required'}),
  username: z.string({required_error: 'Username required'}),
  email: z.string({required_error: 'Email required'}),
  password: z.string({required_error: 'Password required'}),
  verified: z.boolean().optional()
})

export class User {
  static create({id, username, email, password, verified = false}: z.infer<typeof UserValidations>) {
    UserValidations.parse({id, username, email, password})
    return new User(id, username, email, password, verified, false)
  }

  static empty() {
    return new User(undefined, undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly id?: string,
    public readonly username?: string,
    public readonly email?: string,
    public password?: string,
    public verified?: boolean,
    public readonly empty?: boolean
  ) {}

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  cleanUpSensitive() {
    this.password = '[REDACTED]'
    return this
  }

  attributes() {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      verified: this.verified
    }
  }

  toJSON() {
    return {
      id: this.id,
      ...this.attributes()
    }
  }
}
