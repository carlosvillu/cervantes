import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Link} from '../Models/Link.js'
import {LinkRepository} from '../Repositories/LinkRepository.js'
import {RedisLinkRepository} from '../Repositories/RedisLinkRepository/index.js'

export interface FindByIDLinkUseCaseInput {
  id: string
  userID: string
}

export class FindByIDLinkUseCase implements UseCase<FindByIDLinkUseCaseInput, Link> {
  static create({config}: {config: Config}) {
    return new FindByIDLinkUseCase(config, RedisLinkRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: LinkRepository) {}

  async execute({id, userID}: FindByIDLinkUseCaseInput): Promise<Link> {
    return this.repository.findByID(ID.create({value: id}), ID.create({value: userID}))
  }
}
