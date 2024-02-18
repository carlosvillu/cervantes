import {InvalidateCache, InvalidateCacheConfig} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {Chapter} from '../Models/Chapter.js'
import {Summary} from '../Models/Summary.js'
import {Title} from '../Models/Title.js'
import {ChapterRepository} from '../Repository/ChapterRepository.js'
import {HTTPChapterRepository} from '../Repository/HTTPChapterRepository.js'

export interface UpdateChapterUseCaseInput {
  title: string
  summary: string
  id: string
  bookID: string
  userID: string
  createdAt: string
}

export class UpdateChapterUseCase implements UseCase<UpdateChapterUseCaseInput, Chapter> {
  static create({config}: {config: Config}) {
    return new UpdateChapterUseCase(HTTPChapterRepository.create(config))
  }

  constructor(private readonly repository: ChapterRepository) {}

  @InvalidateCache({
    references: (arg: UpdateChapterUseCaseInput, _response) => {
      return ['chapter:' + arg.id, 'chapter:all:' + arg.bookID, 'chapter:root']
    }
  } as const as InvalidateCacheConfig<Chapter>)
  async execute({title, userID, bookID, summary, id, createdAt}: UpdateChapterUseCaseInput): Promise<Chapter> {
    return this.repository.update(
      Chapter.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        bookID: ID.create({value: bookID}),
        title: Title.create({value: title}),
        summary: Summary.create({value: summary}),
        createdAt: TimeStamp.create({value: +createdAt}),
        updatedAt: TimeStamp.now()
      })
    )
  }
}
