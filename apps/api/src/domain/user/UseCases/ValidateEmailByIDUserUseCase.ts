import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {User} from '../Models/User.js'
import {RedisUserRepository} from '../Repository/RedisUserRepository/index.js'
import {UserRepository} from '../Repository/UserRepository.js'

export interface ValidateEmailByIDUserUseCaseInput {
  id: string
}

export class ValidateEmailByIDUserUseCase implements UseCase<ValidateEmailByIDUserUseCaseInput, User> {
  static create() {
    return new ValidateEmailByIDUserUseCase(RedisUserRepository.create())
  }

  constructor(private readonly repository: UserRepository) {}

  async execute({id}: ValidateEmailByIDUserUseCaseInput): Promise<User> {
    return this.repository.validateEmailByID(ID.create({value: id}))
  }
}
