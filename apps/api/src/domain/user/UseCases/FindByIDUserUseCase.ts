import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {User} from '../Models/User.js'
import {RedisUserRepository} from '../Repository/RedisUserRepository/index.js'
import {UserRepository} from '../Repository/UserRepository.js'

export interface FindByIDUserUseCaseInput {
  id: string
}

export class FindByIDUserUseCase implements UseCase<FindByIDUserUseCaseInput, User> {
  static create() {
    return new FindByIDUserUseCase(RedisUserRepository.create())
  }

  constructor(private readonly repository: UserRepository) {}

  async execute({id}: FindByIDUserUseCaseInput): Promise<User> {
    return this.repository.findByID(ID.create({value: id}))
  }
}
