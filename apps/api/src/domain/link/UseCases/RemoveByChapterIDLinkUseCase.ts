import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Links} from '../Models/Links.js'
import {LinkRepository} from '../Repositories/LinkRepository.js'
import {RedisLinkRepository} from '../Repositories/RedisLinkRepository/index.js'

export interface RemoveByChapterIDLinkUseCaseInput {
  id: string
  userID: string
}

export class RemoveByChapterIDLinkUseCase implements UseCase<RemoveByChapterIDLinkUseCaseInput, Links> {
  static create() {
    return new RemoveByChapterIDLinkUseCase(RedisLinkRepository.create())
  }

  constructor(private readonly repository: LinkRepository) {}

  async execute({id, userID}: RemoveByChapterIDLinkUseCaseInput): Promise<Links> {
    return this.repository.removeByChapterID(ID.create({value: id}), ID.create({value: userID}))
  }
}
