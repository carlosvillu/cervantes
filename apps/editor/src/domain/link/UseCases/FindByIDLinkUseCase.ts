import {Cache, CacheConfig} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Link} from '../Models/Link.js'
import {HTTPLinkRepository} from '../Repositories/HTTPLinkRepository'
import {LinkRepository} from '../Repositories/LinkRepository.js'

export interface FindByIDLinkUseCaseInput {
  id: string
  userID: string
}

export class FindByIDLinkUseCase implements UseCase<FindByIDLinkUseCaseInput, Link> {
  static create({config}: {config: Config}) {
    return new FindByIDLinkUseCase(HTTPLinkRepository.create(config))
  }

  constructor(private readonly repository: LinkRepository) {}

  @Cache({
    name: 'FindByIDLinkUseCase',
    ttl: Number.MAX_SAFE_INTEGER,
    references(_args: FindByIDLinkUseCaseInput, _key, result) {
      return ['link:' + result.id]
    }
  } as const as CacheConfig<Link>)
  async execute({id}: FindByIDLinkUseCaseInput): Promise<Link> {
    return this.repository.findByID(ID.create({value: id}))
  }
}
