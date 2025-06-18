export {AuthTokens, AuthTokensValidationSchema} from './AuthTokens'
export {ValidationToken, ValidationTokenValidationSchema} from './ValidationToken'
export {SignupRequest, SignupRequestValidationSchema} from './SignupRequest'
export {LoginRequest, LoginRequestValidationSchema} from './LoginRequest'
export {RefreshRequest, RefreshRequestValidationSchema} from './RefreshRequest'

export interface AuthenticationError {
  code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'USER_NOT_VERIFIED'
  message: string
}

export interface AuthValidation {
  isValid: boolean
  errors: string[]
}

export type AuthTokenType = 'access' | 'refresh'

export interface TokenPayload {
  sub?: string
  userId?: string
  exp: number
  iat?: number
  [key: string]: unknown
}
