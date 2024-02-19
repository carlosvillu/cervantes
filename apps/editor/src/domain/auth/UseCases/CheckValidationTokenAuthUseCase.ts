import {z} from 'zod'

import {InvalidateCache, InvalidateCacheConfig} from '@cervantes/decorators'

import {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Token} from '../Models/Token.js'
import {ValidationStatus} from '../Models/ValidationStatus.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {HTTPAuthRepository} from '../Repositories/HTTPAuthRepository.js'

const CheckValidationTokenAuthUseCaseValidation = z.object({
  id: z.string({required_error: 'id required'}),
  code: z.string({required_error: 'code required'})
})
export type CheckValidationTokenAuthUseCaseInput = z.infer<typeof CheckValidationTokenAuthUseCaseValidation>

export class CheckValidationTokenAuthUseCase
  implements UseCase<CheckValidationTokenAuthUseCaseInput, ValidationStatus>
{
  static create({config}: {config: Config}) {
    return new CheckValidationTokenAuthUseCase(HTTPAuthRepository.create(config))
  }

  constructor(private readonly repository: AuthRepository) {}

  @InvalidateCache({references: () => ['*']} as const as InvalidateCacheConfig<ValidationStatus>)
  async execute({id, code}: CheckValidationTokenAuthUseCaseInput): Promise<ValidationStatus> {
    const validationToken = await this.repository.checkValidationToken(
      ID.create({value: id}),
      Token.create({value: code})
    )
    return validationToken
  }
}
