/* eslint @typescript-eslint/no-non-null-assertion:0 */

import type {RedisClientType} from 'redis'
import {EntityId, Repository} from 'redis-om'

import {ID} from '../../../_kernel/ID.js'
import {Redis} from '../../../_redis/index.js'
import {Email} from '../../Models/Email.js'
import {Password} from '../../Models/Password.js'
import {PlainPassword} from '../../Models/PlainPassword.js'
import {User} from '../../Models/User.js'
import {UserRepository} from '../UserRepository.js'
import {UserRecord, userSchema} from './schemas.js'

export class RedisUserRepository implements UserRepository {
  #indexCreated = false
  #userRepository: Repository | undefined = undefined

  static create() {
    return new RedisUserRepository()
  }

  async findByID(id: ID): Promise<User> {
    await this.#createIndex()
    const userRecord = (await this.#userRepository?.fetch(id.value)) as UserRecord

    if (userRecord === null || userRecord === undefined) return User.empty()

    return User.create({
      id: userRecord[EntityId] as string,
      email: userRecord.email,
      username: userRecord.username,
      password: userRecord.password,
      verified: userRecord.verified
    }).cleanUpSensitive()
  }

  async validateEmailByID(id: ID): Promise<User> {
    await this.#createIndex()
    const userRecord = (await this.#userRepository?.fetch(id.value)) as UserRecord

    if (userRecord === null || userRecord === undefined) return User.empty()

    const user = User.create({
      id: userRecord[EntityId] as string,
      email: userRecord.email,
      username: userRecord.username,
      password: userRecord.password,
      verified: true
    })

    await this.#userRepository?.save(user.id!, user.attributes())

    return user.cleanUpSensitive()
  }

  async findOneByEmail(email: Email): Promise<User> {
    await this.#createIndex()
    const userRecord = (await this.#userRepository
      ?.search()
      .where('email')
      .equals(email.value)
      .return.first()) as UserRecord

    if (userRecord === null || userRecord === undefined) return User.empty()

    return User.create({
      id: userRecord[EntityId] as string,
      email: userRecord.email,
      username: userRecord.username,
      password: userRecord.password,
      verified: userRecord.verified
    })
  }

  async create(user: User): Promise<User> {
    if (user.isEmpty()) return user

    await this.#createIndex()

    const userRecord = await this.#userRepository?.save(user.id!, user.attributes())

    if (userRecord === null || userRecord === undefined) return User.empty()
    return user
  }

  async verify(email: Email, password: PlainPassword): Promise<User> {
    await this.#createIndex()

    const user = await this.findOneByEmail(email)

    if (user.isEmpty()) return user

    const isValid = await password.equals(Password.fromHashedPassword({value: user.password!}))

    if (!isValid) return User.empty()

    return user.cleanUpSensitive()
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const client = (await Redis.create().createAndConnectClient()) as RedisClientType

    this.#userRepository = new Repository(userSchema, client)
    this.#indexCreated = true
    return this.#userRepository.createIndex()
  }
}
