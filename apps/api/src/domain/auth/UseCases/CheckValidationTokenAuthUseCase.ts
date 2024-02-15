import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Token} from '../Models/Token.js'
import {ValidationStatus} from '../Models/ValidationStatus.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {RedisAuthRepository} from '../Repositories/RedisAuthRepository/index.js'

export interface CheckValidationTokenAuthUseCaseInput {
  id: string
  userID: string
  token: string
}

export class CheckValidationTokenAuthUseCase
  implements UseCase<CheckValidationTokenAuthUseCaseInput, ValidationStatus>
{
  static create() {
    return new CheckValidationTokenAuthUseCase(RedisAuthRepository.create())
  }

  constructor(private readonly repository: AuthRepository) {}

  async execute({id, userID, token}: CheckValidationTokenAuthUseCaseInput): Promise<ValidationStatus> {
    const validationStatus = await this.repository.checkValidationToken(
      ID.create({value: id}),
      ID.create({value: userID}),
      Token.create({value: token})
    )

    return validationStatus
  }
}
