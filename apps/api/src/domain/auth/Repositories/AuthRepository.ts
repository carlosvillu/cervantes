import type {AuthTokens} from '../Models/AuthTokens.js'
import type {ID} from '../Models/ID.js'
import type {Token} from '../Models/Token.js'
import type {UserToken} from '../Models/UserToken.js'

export interface AuthRepository {
  generateTokens: (id: ID) => Promise<AuthTokens>
  verifyRefreshToken: (token: Token) => Promise<boolean>
  remove: (token: UserToken) => Promise<void>
  findOneByUserID: (id: ID) => Promise<UserToken>
  findOneByToken: (token: Token) => Promise<UserToken>
  create: (userID: string, token: string) => Promise<UserToken>
}
