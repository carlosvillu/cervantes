import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapter} from '../Models/Chapter.js'
import {Summary} from '../Models/Summary.js'
import {Title} from '../Models/Title.js'
import {ChapterRepository} from '../Repository/ChapterRepository.js'
import {HTTPChapterRepository} from '../Repository/HTTPChapterRepository.js'

export interface CreateChapterUseCaseInput {
  title: string
  summary: string
  id: string
  bookID: string
  userID: string
}

export class CreateChapterUseCase implements UseCase<CreateChapterUseCaseInput, Chapter> {
  static create({config}: {config: Config}) {
    return new CreateChapterUseCase(config, HTTPChapterRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: ChapterRepository) {}

  async execute({title, userID, bookID, summary, id}: CreateChapterUseCaseInput): Promise<Chapter> {
    return this.repository.create(
      Chapter.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        bookID: ID.create({value: bookID}),
        title: Title.create({value: title}),
        summary: Summary.create({value: summary})
      })
    )
  }
}
