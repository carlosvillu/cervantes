import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapters} from '../Models/Chapters.js'
import {ChapterRepository} from '../Repositories/ChapterRepository.js'
import {RedisChapterRepository} from '../Repositories/RedisChapterRepository/index.js'

export interface GetAllChapterUseCaseInput {
  bookID: string
  userID: string
}

export class GetAllChapterUseCase implements UseCase<GetAllChapterUseCaseInput, Chapters> {
  static create() {
    return new GetAllChapterUseCase(RedisChapterRepository.create())
  }

  constructor(private readonly repository: ChapterRepository) {}

  async execute({userID, bookID}: GetAllChapterUseCaseInput): Promise<Chapters> {
    return this.repository.findAll(ID.create({value: userID}), ID.create({value: bookID}))
  }
}
