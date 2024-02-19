import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {ValidationToken} from '../Models/ValidationToken.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {RedisAuthRepository} from '../Repositories/RedisAuthRepository/index.js'

export interface FindByIDValidationTokenAuthUseCaseInput {
  id: string
  userID: string
}

export class FindByIDValidationTokenAuthUseCase
  implements UseCase<FindByIDValidationTokenAuthUseCaseInput, ValidationToken>
{
  static create() {
    return new FindByIDValidationTokenAuthUseCase(RedisAuthRepository.create())
  }

  constructor(private readonly repository: AuthRepository) {}

  async execute({id, userID}: FindByIDValidationTokenAuthUseCaseInput): Promise<ValidationToken> {
    const validationStatus = await this.repository.findByIDValidationToken(
      ID.create({value: id}),
      ID.create({value: userID})
    )

    return validationStatus
  }
}
