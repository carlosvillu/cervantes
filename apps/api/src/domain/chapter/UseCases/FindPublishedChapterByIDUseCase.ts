import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Book} from '../../book/Models/Book.js'
import {FindPublishedBookByIDUseCase} from '../../book/UseCases/FindPublishedBookByIDUseCase.js'
import {Chapter} from '../Models/Chapter.js'
import {ChapterRepository} from '../Repositories/ChapterRepository.js'
import {RedisChapterRepository} from '../Repositories/RedisChapterRepository/index.js'

export interface FindPublishedChapterByIDUseCaseInput {
  id: string
  bookID: string
}

export class FindPublishedChapterByIDUseCase implements UseCase<FindPublishedChapterByIDUseCaseInput, Chapter> {
  static create() {
    return new FindPublishedChapterByIDUseCase(
      FindPublishedBookByIDUseCase.create(),
      RedisChapterRepository.create()
    )
  }

  constructor(
    private readonly findPublishedBookByIDUseCase: FindPublishedBookByIDUseCase,
    private readonly repository: ChapterRepository
  ) {}

  async execute({id, bookID}: FindPublishedChapterByIDUseCaseInput): Promise<Chapter> {
    const book = await this.findPublishedBookByIDUseCase.execute({id: bookID})
    if (book.isEmpty()) return Chapter.empty()

    return this.repository.findPublishedByID(ID.create({value: id}), ID.create({value: bookID}))
  }
}
