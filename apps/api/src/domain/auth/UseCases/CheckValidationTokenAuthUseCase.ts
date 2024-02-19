import {Broker} from '../../_broker/index.js'
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
    return new CheckValidationTokenAuthUseCase(RedisAuthRepository.create(), Broker.create())
  }

  constructor(private readonly repository: AuthRepository, private readonly broker: Broker) {}

  async execute({id, userID, token}: CheckValidationTokenAuthUseCaseInput): Promise<ValidationStatus> {
    const validationStatus = await this.repository.checkValidationToken(
      ID.create({value: id}),
      ID.create({value: userID}),
      Token.create({value: token})
    )

    await this.broker.emit({
      type: 'check_validation_token',
      payload: {id: ID.create({value: id}), userID: ID.create({value: userID}), status: validationStatus}
    })

    return validationStatus
  }
}
