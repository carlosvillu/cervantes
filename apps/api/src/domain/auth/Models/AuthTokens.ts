export class AuthTokens {
  static create({access, refresh}: {access: string; refresh: string}) {
    return new AuthTokens(access, refresh)
  }

  constructor(private readonly access: string, private readonly refresh: string) {}

  toJSON() {
    return {access: this.access, refresh: this.refresh}
  }
}
