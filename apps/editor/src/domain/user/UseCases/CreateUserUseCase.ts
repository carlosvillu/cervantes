import {z} from 'zod'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {Email} from '../Models/Email.js'
import {ID} from '../Models/ID.ts'
import {PlainPassword} from '../Models/PlainPassword.js'
import {User} from '../Models/User.ts'
import {Username} from '../Models/Username.ts'
import {HTTPUserRepository} from '../Repositories/HTTPUserRepository.js'
import type {UserRepository} from '../Repositories/UserRepository.js'

const CreateUserUseCaseValidations = z.object({
  email: z.string({required_error: 'Email required'}),
  username: z.string({required_error: 'Username required'}),
  password: z.string({required_error: 'Password required'}),
  id: z.string({required_error: 'ID required'})
})

export type CreateUserUseCaseInput = z.infer<typeof CreateUserUseCaseValidations>

export class CreateUserUseCase implements UseCase<CreateUserUseCaseInput, User> {
  static create({config}: {config: Config}) {
    return new CreateUserUseCase(config, HTTPUserRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: UserRepository) {}

  async execute({email, password, username, id}: CreateUserUseCaseInput): Promise<User> {
    return this.repository.create(
      ID.create({value: id}),
      Username.create({value: username}),
      Email.create({value: email}),
      PlainPassword.create({value: password})
    )
  }
}
