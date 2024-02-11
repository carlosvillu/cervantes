import {Emailer} from '../../_emailer/Emailer.js'
import {ResendEmailer} from '../../_emailer/ResendEmailer.js'
import {UseCase} from '../../_kernel/architecture.js'
import {Email} from '../../_kernel/Email.js'
import {ID} from '../../_kernel/ID.js'
import {ValidationToken} from '../Models/ValidationToken.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {RedisAuthRepository} from '../Repositories/RedisAuthRepository/index.js'

export interface SendValidationCodeAuthUseCaseInput {
  id: string
  email: string
}

export class SendValidationCodeAuthUseCase implements UseCase<SendValidationCodeAuthUseCaseInput, ValidationToken> {
  static create() {
    return new SendValidationCodeAuthUseCase(RedisAuthRepository.create(), ResendEmailer.create())
  }

  constructor(private readonly repository: AuthRepository, private readonly emailer: Emailer) {}

  async execute({id, email}: SendValidationCodeAuthUseCaseInput): Promise<ValidationToken> {
    const validationToken = await this.repository.sendValidationToken(ID.create({value: id}))

    await this.emailer.sendValidationToken(validationToken, Email.create({value: email}))

    return validationToken
  }
}
