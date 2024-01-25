import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Links} from '../Models/Links.js'
import {LinkRepository} from '../Repositories/LinkRepository.js'
import {RedisLinkRepository} from '../Repositories/RedisLinkRepository/index.js'

export interface GetAllLinkUseCaseInput {
  from: string
  userID: string
}

export class GetAllLinkUseCase implements UseCase<GetAllLinkUseCaseInput, Links> {
  static create() {
    return new GetAllLinkUseCase(RedisLinkRepository.create())
  }

  constructor(private readonly repository: LinkRepository) {}

  async execute({from, userID}: GetAllLinkUseCaseInput): Promise<Links> {
    return this.repository.findAll(ID.create({value: from}), ID.create({value: userID}))
  }
}
