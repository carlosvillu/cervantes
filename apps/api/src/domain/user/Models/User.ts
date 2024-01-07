import {z} from 'zod'

const UserValidations = z.object({
  id: z.string({required_error: 'ID required'}),
  username: z.string({required_error: 'Username required'}),
  email: z.string({required_error: 'Email required'}),
  password: z.string({required_error: 'Password required'})
})

export class User {
  static create({id, username, email, password}: {id: string; username: string; email: string; password?: string}) {
    UserValidations.parse({id, username, email, password})
    return new User(id, username, email, password, false)
  }

  static empty() {
    return new User(undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly id?: string,
    public readonly username?: string,
    public readonly email?: string,
    public password?: string,
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
      password: this.password
    }
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password
    }
  }
}
