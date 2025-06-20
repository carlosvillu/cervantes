export {AuthTokens, AuthTokensValidationSchema} from './AuthTokens.js'
export {ValidationToken, ValidationTokenValidationSchema} from './ValidationToken.js'
export {SignupRequest, SignupRequestValidationSchema} from './SignupRequest.js'
export {LoginRequest, LoginRequestValidationSchema} from './LoginRequest.js'
export {RefreshRequest, RefreshRequestValidationSchema} from './RefreshRequest.js'
export type {AuthRepository} from './AuthRepository.js'

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
