import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {FindPublishedBookByIDUseCase} from '../../book/UseCases/FindPublishedBookByIDUseCase.js'
import {Links} from '../Models/Links.js'
import {LinkRepository} from '../Repositories/LinkRepository.js'
import {RedisLinkRepository} from '../Repositories/RedisLinkRepository/index.js'

export interface FindAllPublishedLinksUseCaseInput {
  chapterID: string
  bookID: string
}

export class FindAllPublishedLinksUseCase implements UseCase<FindAllPublishedLinksUseCaseInput, Links> {
  static create() {
    return new FindAllPublishedLinksUseCase(FindPublishedBookByIDUseCase.create(), RedisLinkRepository.create())
  }

  constructor(
    private readonly findPublishedBookByIDUseCase: FindPublishedBookByIDUseCase,
    private readonly repository: LinkRepository
  ) {}

  async execute({chapterID, bookID}: FindAllPublishedLinksUseCaseInput): Promise<Links> {
    const book = await this.findPublishedBookByIDUseCase.execute({id: bookID})
    if (book.isEmpty()) return Links.empty()

    return this.repository.findAllPublished(ID.create({value: chapterID}))
  }
}
