import {Cache, CacheConfig} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Links} from '../Models/Links.js'
import {HTTPLinkRepository} from '../Repositories/HTTPLinkRepository'
import {LinkRepository} from '../Repositories/LinkRepository.js'

export interface GetAllLinkUseCaseInput {
  from: string
}

export class GetAllLinkUseCase implements UseCase<GetAllLinkUseCaseInput, Links> {
  static create({config}: {config: Config}) {
    return new GetAllLinkUseCase(HTTPLinkRepository.create(config))
  }

  constructor(private readonly repository: LinkRepository) {}

  @Cache({
    name: 'GetAllLinkUseCase',
    ttl: Number.MAX_SAFE_INTEGER,
    references(args: GetAllLinkUseCaseInput, _key, _result) {
      return ['link:all:' + args.from]
    }
  } as const as CacheConfig<Links>)
  async execute({from}: GetAllLinkUseCaseInput): Promise<Links> {
    return this.repository.findAll(ID.create({value: from}))
  }
}
