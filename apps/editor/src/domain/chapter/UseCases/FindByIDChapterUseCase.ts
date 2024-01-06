import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapter} from '../Models/Chapter.js'
import {ChapterRepository} from '../Repository/ChapterRepository.js'
import {HTTPChapterRepository} from '../Repository/HTTPChapterRepository.js'

export interface FindByIDChapterUseCaseInput {
  id: string
  bookID: string
}

export class FindByIDChapterUseCase implements UseCase<FindByIDChapterUseCaseInput, Chapter> {
  static create({config}: {config: Config}) {
    return new FindByIDChapterUseCase(config, HTTPChapterRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: ChapterRepository) {}

  async execute({id, bookID}: FindByIDChapterUseCaseInput): Promise<Chapter> {
    return this.repository.findByID(ID.create({value: id}), ID.create({value: bookID}))
  }
}
