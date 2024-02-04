import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapter} from '../Models/Chapter.js'
import {ChapterRepository} from '../Repository/ChapterRepository.js'
import {HTTPChapterRepository} from '../Repository/HTTPChapterRepository'

export interface RemoveByIDChapterUseCaseInput {
  id: string
  bookID: string
}

export class RemoveByIDChapterUseCase implements UseCase<RemoveByIDChapterUseCaseInput, Chapter> {
  static create({config}: {config: Config}) {
    return new RemoveByIDChapterUseCase(HTTPChapterRepository.create(config))
  }

  constructor(private readonly repository: ChapterRepository) {}

  async execute({id, bookID}: RemoveByIDChapterUseCaseInput): Promise<Chapter> {
    return this.repository.removeByID(ID.create({value: id}), ID.create({value: bookID}))
  }
}
