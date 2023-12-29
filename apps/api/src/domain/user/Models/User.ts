export class User {
  static create({id, username, email, password}: {id: string; username: string; email: string; password?: string}) {
    if (id === undefined || username === undefined || email === undefined)
      throw new Error(
        `[User.create] Missing required params username(${username}) id(${id}) email(${email}) password(${password ?? '[NOT DEFINED]'})` //eslint-disable-line
      )
    return new User(id, username, email, password, false)
  }

  static empty() {
    return new User(undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly id?: string,
    public readonly username?: string,
    public email?: string,
    public readonly password?: string,
    public readonly empty?: boolean
  ) {}

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  cleanUpSensitive() {
    this.email = undefined
    return this
  }

  attributes() {
    return {
      username: this.username,
      email: this.email,
      password: this.password
    }
  }
}
