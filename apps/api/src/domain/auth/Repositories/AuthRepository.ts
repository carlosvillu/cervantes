import type {ID} from '../../_kernel/ID.js'
import type {AuthTokens} from '../Models/AuthTokens.js'
import type {Token} from '../Models/Token.js'
import type {UserToken} from '../Models/UserToken.js'
import {ValidationStatus} from '../Models/ValidationStatus.js'
import {ValidationToken} from '../Models/ValidationToken.js'

export interface AuthRepository {
  generateTokens: (id: ID) => Promise<AuthTokens>
  verifyRefreshToken: (token: Token) => Promise<AuthTokens>
  removeByUserToken: (token: UserToken) => Promise<void>
  removeByRefreshToken: (token: Token) => Promise<AuthTokens>
  findOneByUserID: (id: ID) => Promise<UserToken>
  findOneByToken: (token: Token) => Promise<UserToken>
  create: (userID: string, token: string) => Promise<UserToken>
  createValidationToken: (userID: ID) => Promise<ValidationToken>
  checkValidationToken: (id: ID, userID: ID, token: Token) => Promise<ValidationStatus>
  findByIDValidationToken: (id: ID, userID: ID) => Promise<ValidationToken>
}
