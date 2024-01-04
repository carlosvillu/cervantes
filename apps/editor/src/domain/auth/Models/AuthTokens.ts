import {z} from 'zod'

const AuthTokenValidations = z.object({
  access: z.string({required_error: 'Access is required'}),
  refresh: z.string({required_error: 'Refresh is required'})
})

export class AuthTokens {
  static create({access, refresh}: z.infer<typeof AuthTokenValidations>) {
    AuthTokenValidations.parse({access, refresh})
    return new AuthTokens(access, refresh, false)
  }

  static empty() {
    return new AuthTokens(undefined, undefined, true)
  }

  constructor(private readonly access?: string, private readonly refresh?: string, public readonly empty?: boolean) {}

  isEmpty(): boolean {
    return this.empty !== undefined && this.empty
  }

  toJSON() {
    return {access: this.access, refresh: this.refresh}
  }
}
