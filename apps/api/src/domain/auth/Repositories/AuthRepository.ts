import type {ID} from '../../_kernel/ID.js'
import type {AuthTokens} from '../Models/AuthTokens.js'
import type {Token} from '../Models/Token.js'
import type {UserToken} from '../Models/UserToken.js'
import {ValidationToken} from '../Models/ValidationToken.js'

export interface AuthRepository {
  generateTokens: (id: ID) => Promise<AuthTokens>
  verifyRefreshToken: (token: Token) => Promise<AuthTokens>
  removeByUserToken: (token: UserToken) => Promise<void>
  removeByRefreshToken: (token: Token) => Promise<AuthTokens>
  findOneByUserID: (id: ID) => Promise<UserToken>
  findOneByToken: (token: Token) => Promise<UserToken>
  create: (userID: string, token: string) => Promise<UserToken>
  sendValidationToken: (userID: ID) => Promise<ValidationToken>
}
