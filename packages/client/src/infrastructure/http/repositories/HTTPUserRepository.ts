/**
 * HTTPUserRepository - HTTP implementation of UserRepository
 *
 * This class implements the UserRepository interface using HTTP calls through HTTPClient.
 * It handles all user-related API operations following Clean Architecture patterns.
 */

import {User, UserValidationSchema} from '../../../domain/user/User.js'
import type {UserRepository} from '../../../domain/user/UserRepository.js'
import type {HTTPClient} from '../types.js'

export class HTTPUserRepository implements UserRepository {
  constructor(private readonly httpClient: HTTPClient) {}

  async getCurrentUser(): Promise<User> {
    const [error, data] = await this.httpClient.get('/user/current', {}, UserValidationSchema)

    if (error) {
      throw error
    }

    return User.fromAPI(
      data as {
        id: string
        username: string
        email: string
        password: string
        verified: boolean
      }
    )
  }
}
