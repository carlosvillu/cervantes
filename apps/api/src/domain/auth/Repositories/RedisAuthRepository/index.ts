/* eslint @typescript-eslint/no-non-null-assertion:0 */
// import debug from 'debug'
// const log = debug('cervantes:domain:auth:RedisAuthRepository')
import jwt from 'jsonwebtoken'
import type {RedisClientType} from 'redis'
import {EntityId, Repository} from 'redis-om'

import type {Config} from '../../../_config/index.js'
import type {ID} from '../../../_kernel/ID.js'
import {Redis} from '../../../_redis/index.js'
import {AuthTokens} from '../../Models/AuthTokens.js'
import type {Token} from '../../Models/Token.js'
import {UserToken} from '../../Models/UserToken.js'
import type {AuthRepository} from '../AuthRepository.js'
import {TokenRecord, tokenSchema} from './schemas.js'

const {ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY} = process.env

export class RedisAuthRepository implements AuthRepository {
  #indexCreated = false
  #tokenRepository: Repository | undefined = undefined

  static create(config: Config) {
    return new RedisAuthRepository(config)
  }

  constructor(private readonly config: Config) {}

  async generateTokens(id: ID): Promise<AuthTokens> {
    await this.#createIndex()
    const access = jwt.sign(id.toJSON(), ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: '14m'
    })

    const refresh = jwt.sign(id.toJSON(), REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: '30d'
    })

    const userToken = await this.findOneByUserID(id)
    if (!userToken.isEmpty()) await this.removeByUserToken(userToken)

    await this.create(id.value, refresh)

    return AuthTokens.create({access, refresh})
  }

  async verifyRefreshToken(token: Token): Promise<AuthTokens> {
    const userToken = await this.findOneByToken(token)

    if (userToken.isEmpty()) return AuthTokens.empty()

    return new Promise(resolve => {
      jwt.verify(token.value, REFRESH_TOKEN_PRIVATE_KEY, (err, tokenDetails) => {
        if (err != null) resolve(AuthTokens.empty())
        const {id} = tokenDetails as {id: string}

        const access = jwt.sign({id}, process.env.ACCESS_TOKEN_PRIVATE_KEY, {expiresIn: '14m'})
        resolve(AuthTokens.create({access, refresh: token.value}))
      })
    })
  }

  async findOneByToken(token: Token): Promise<UserToken> {
    await this.#createIndex()
    const tokenRecord = (await this.#tokenRepository
      ?.search()
      .where('token')
      .equals(token.value)
      .return.first()) as TokenRecord

    if (tokenRecord === null || tokenRecord === undefined) return UserToken.empty()

    return UserToken.create({userID: tokenRecord.userID, token: tokenRecord.token, createdAt: tokenRecord.createdAt})
  }

  async create(userID: string, token: string): Promise<UserToken> {
    const tokenRecord = (await this.#tokenRepository?.save({
      token,
      userID,
      createdAt: Math.round(Date.now() / 1000)
    })) as TokenRecord

    if (tokenRecord === null || tokenRecord === undefined)
      throw new Error(`[RedisAuthRepository#create] Record NOT created`)

    return UserToken.create({userID: tokenRecord.userID, token: tokenRecord.token, createdAt: tokenRecord.createdAt})
  }

  async removeByUserToken(userToken: UserToken): Promise<void> {
    await this.#createIndex()
    if (userToken.userID === undefined) throw new Error(`[RedisAuthRepository#remove] UserID mandatory`)
    const tokenRecord = (await this.#tokenRepository
      ?.search()
      .where('userID')
      .equals(userToken.userID)
      .return.first()) as TokenRecord

    if (tokenRecord === null || tokenRecord === undefined)
      throw new Error(`[RedisAuthRepository#remove] Record to remove NO FOUND`)
    await this.#tokenRepository?.remove(tokenRecord[EntityId] as string)
  }

  async removeByRefreshToken(token: Token): Promise<AuthTokens> {
    await this.#createIndex()
    const tokenRecord = (await this.#tokenRepository
      ?.search()
      .where('token')
      .equals(token.value)
      .return.first()) as TokenRecord

    if (tokenRecord === null || tokenRecord === undefined) return AuthTokens.empty()
    await this.#tokenRepository?.remove(tokenRecord[EntityId] as string)
    return AuthTokens.empty()
  }

  async findOneByUserID(id: ID): Promise<UserToken> {
    await this.#createIndex()
    const tokenRecord = (await this.#tokenRepository
      ?.search()
      .where('userID')
      .equals(id.value)
      .return.first()) as TokenRecord

    if (tokenRecord === null || tokenRecord === undefined) return UserToken.empty()

    return UserToken.create({userID: tokenRecord.userID, token: tokenRecord.token, createdAt: tokenRecord.createdAt})
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const client = (await Redis.create().createAndConnectClient()) as RedisClientType

    this.#tokenRepository = new Repository(tokenSchema, client)
    this.#indexCreated = true
    return this.#tokenRepository.createIndex()
  }
}
