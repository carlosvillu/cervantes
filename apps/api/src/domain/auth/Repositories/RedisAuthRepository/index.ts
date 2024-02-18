/* eslint @typescript-eslint/no-non-null-assertion:0 */
// import debug from 'debug'
// const log = debug('cervantes:domain:auth:RedisAuthRepository')
import jwt from 'jsonwebtoken'
import type {RedisClientType} from 'redis'
import {EntityId, Repository} from 'redis-om'

import {ID} from '../../../_kernel/ID.js'
import {TimeStamp} from '../../../_kernel/TimeStamp.js'
import {Redis} from '../../../_redis/index.js'
import {AuthTokens} from '../../Models/AuthTokens.js'
import {Token} from '../../Models/Token.js'
import {UserToken} from '../../Models/UserToken.js'
import {ValidationStatus} from '../../Models/ValidationStatus.js'
import {ValidationToken} from '../../Models/ValidationToken.js'
import type {AuthRepository} from '../AuthRepository.js'
import {TokenRecord, tokenSchema, ValidationTokenRecord, validationTokenSchema} from './schemas.js'

const {ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY} = process.env

export class RedisAuthRepository implements AuthRepository {
  static FIVE_MINUTES_IN_SECONDS = 5 * 60
  #indexCreated = false
  #tokenRepository: Repository | undefined = undefined
  #validationTokenRepository: Repository | undefined = undefined

  static create() {
    return new RedisAuthRepository()
  }

  async generateTokens(id: ID): Promise<AuthTokens> {
    await this.#createIndex()
    const access = jwt.sign(id.toJSON(), ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: '10m'
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

        const access = jwt.sign({id}, process.env.ACCESS_TOKEN_PRIVATE_KEY, {expiresIn: '10m'})
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

  async checkValidationToken(id: ID, userID: ID, token: Token): Promise<ValidationStatus> {
    await this.#createIndex()

    const currentValidationTokenRecord = (await this.#validationTokenRepository
      ?.searchRaw(`@userID:{${userID.value}} @token:{${token.value}}`)
      .return.first()) as ValidationTokenRecord

    if (!currentValidationTokenRecord) return ValidationStatus.failed()

    return ValidationStatus.success()
  }

  async findByIDValidationToken(id: ID, userID: ID): Promise<ValidationToken> {
    await this.#createIndex()

    const validationToken = (await this.#validationTokenRepository?.fetch(id.value)) as ValidationTokenRecord

    if (!validationToken) return ValidationToken.empty()
    if (validationToken.userID !== userID.value) return ValidationToken.empty()

    return ValidationToken.create({
      id: ID.create({value: validationToken[EntityId]!}),
      token: Token.create({value: validationToken.token}),
      userID: ID.create({value: validationToken.userID}),
      ...(validationToken.createdAt && {createdAt: TimeStamp.create({value: validationToken.createdAt})})
    })
  }

  async createValidationToken(userID: ID): Promise<ValidationToken> {
    await this.#createIndex()

    const currentValidationTokenRecord = (await this.#validationTokenRepository
      ?.search()
      .where('userID')
      .equals(userID.value)
      .return.first()) as ValidationTokenRecord

    if (currentValidationTokenRecord) {
      await this.#validationTokenRepository?.remove(currentValidationTokenRecord[EntityId] as string)
    }

    const validationToken = ValidationToken.create({
      id: ID.random(),
      token: Token.sixDigitRandom(),
      createdAt: TimeStamp.now(),
      userID
    })

    const validationTokenRecord = await this.#validationTokenRepository?.save(
      validationToken.id!,
      validationToken.attributes()
    )

    if (!validationTokenRecord) return ValidationToken.empty()
    await this.#validationTokenRepository?.expire(
      validationTokenRecord[EntityId]!,
      RedisAuthRepository.FIVE_MINUTES_IN_SECONDS
    )

    return validationToken
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const client = (await Redis.create().createAndConnectClient()) as RedisClientType

    this.#tokenRepository = new Repository(tokenSchema, client)
    this.#validationTokenRepository = new Repository(validationTokenSchema, client)
    this.#indexCreated = true
    await this.#tokenRepository.createIndex()
    await this.#validationTokenRepository.createIndex()
  }
}
