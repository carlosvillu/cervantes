import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {Email} from '../Models/Email.js'
import {PlainPassword} from '../Models/PlainPassword.js'
import {User} from '../Models/User.js'
import {RedisUserRepository} from '../Repository/RedisUserRepository/index.js'
import {UserRepository} from '../Repository/UserRepository.js'

export interface VerifyEmailAndPasswordUserUseCaseInput {
  email: string
  password: string
}

export class VerifyEmailAndPasswordUserUseCase implements UseCase<VerifyEmailAndPasswordUserUseCaseInput, User> {
  static create({config}: {config: Config}) {
    return new VerifyEmailAndPasswordUserUseCase(config, RedisUserRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: UserRepository) {}

  async execute({email, password}: VerifyEmailAndPasswordUserUseCaseInput): Promise<User> {
    const pass = PlainPassword.create({value: password})
    return this.repository.verify(Email.create({value: email}), pass)
  }
}
