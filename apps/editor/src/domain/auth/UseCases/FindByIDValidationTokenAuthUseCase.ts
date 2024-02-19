import {z} from 'zod'

import {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {ValidationToken} from '../Models/ValidationToken.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {HTTPAuthRepository} from '../Repositories/HTTPAuthRepository.js'

const FindByIDValidationTokenAuthUseCaseValidation = z.object({
  id: z.string({required_error: 'id required'})
})
export type FindByIDValidationTokenAuthUseCaseInput = z.infer<typeof FindByIDValidationTokenAuthUseCaseValidation>

export class FindByIDValidationTokenAuthUseCase
  implements UseCase<FindByIDValidationTokenAuthUseCaseInput, ValidationToken>
{
  static create({config}: {config: Config}) {
    return new FindByIDValidationTokenAuthUseCase(HTTPAuthRepository.create(config))
  }

  constructor(private readonly repository: AuthRepository) {}

  async execute({id}: FindByIDValidationTokenAuthUseCaseInput): Promise<ValidationToken> {
    const validationToken = await this.repository.findByIDValidationToken(ID.create({value: id}))
    return validationToken
  }
}
