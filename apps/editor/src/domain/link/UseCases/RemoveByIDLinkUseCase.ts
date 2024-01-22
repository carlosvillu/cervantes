import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Link} from '../Models/Link.js'
import {HTTPLinkRepository} from '../Repositories/HTTPLinkRepository'
import {LinkRepository} from '../Repositories/LinkRepository.js'

export interface RemoveByIDLinkUseCaseInput {
  id: string
}

export class RemoveByIDLinkUseCase implements UseCase<RemoveByIDLinkUseCaseInput, Link> {
  static create({config}: {config: Config}) {
    return new RemoveByIDLinkUseCase(HTTPLinkRepository.create(config))
  }

  constructor(private readonly repository: LinkRepository) {}

  async execute({id}: RemoveByIDLinkUseCaseInput): Promise<Link> {
    return this.repository.removeByID(ID.create({value: id}))
  }
}
