export class AuthTokens {
  static create({access, refresh}: {access: string; refresh: string}) {
    if (access === undefined || refresh === undefined)
      throw new Error(
        `[AuthTokens.create] Missing required params access(${access}) refresh(${refresh})` //eslint-disable-line
      )

    return new AuthTokens(access, refresh, false)
  }

  static empty() {
    return new AuthTokens(undefined, undefined, true)
  }

  constructor(private readonly access?: string, private readonly refresh?: string, public readonly empty?: boolean) {}

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  toJSON() {
    return {access: this.access, refresh: this.refresh}
  }
}
