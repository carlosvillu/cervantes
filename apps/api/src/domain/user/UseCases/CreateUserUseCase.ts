import {UseCase} from '../../_kernel/architecture.js'
import {Password} from '../Models/Password.js'
import {User} from '../Models/User.js'
import {RedisUserRepository} from '../Repository/RedisUserRepository/index.js'
import {UserRepository} from '../Repository/UserRepository.js'

export interface CreateUserUseCaseInput {
  username: string
  email: string
  password: string
  id: string
}

export class CreateUserUseCase implements UseCase<CreateUserUseCaseInput, User> {
  static create() {
    return new CreateUserUseCase(RedisUserRepository.create())
  }

  constructor(private readonly repository: UserRepository) {}

  async execute({email, username, password, id}: CreateUserUseCaseInput): Promise<User> {
    const pass = await Password.create({value: password}).hash()
    return this.repository.create(User.create({email, username, password: pass.value, id}))
  }
}
