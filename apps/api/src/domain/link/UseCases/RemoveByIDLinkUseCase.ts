import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Link} from '../Models/Link.js'
import {LinkRepository} from '../Repositories/LinkRepository.js'
import {RedisLinkRepository} from '../Repositories/RedisLinkRepository/index.js'

export interface RemoveByIDLinkUseCaseInput {
  id: string
  userID: string
}

export class RemoveByIDLinkUseCase implements UseCase<RemoveByIDLinkUseCaseInput, Link> {
  static create() {
    return new RemoveByIDLinkUseCase(RedisLinkRepository.create())
  }

  constructor(private readonly repository: LinkRepository) {}

  async execute({id, userID}: RemoveByIDLinkUseCaseInput): Promise<Link> {
    return this.repository.removeByID(ID.create({value: id}), ID.create({value: userID}))
  }
}
