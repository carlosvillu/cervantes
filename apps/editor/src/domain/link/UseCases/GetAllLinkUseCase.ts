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
    return new GetAllLinkUseCase(config, HTTPLinkRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: LinkRepository) {}

  async execute({from}: GetAllLinkUseCaseInput): Promise<Links> {
    return this.repository.findAll(ID.create({value: from}))
  }
}
