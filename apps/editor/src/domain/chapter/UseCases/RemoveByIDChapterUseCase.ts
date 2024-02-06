import {InvalidateCache, InvalidateCacheConfig} from '@cervantes/decorators'

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

  @InvalidateCache({
    references: (arg: RemoveByIDChapterUseCaseInput, _response) => {
      return ['chapter:' + arg.id, 'chapter:all:' + arg.bookID]
    }
  } as const as InvalidateCacheConfig<Chapter>)
  async execute({id, bookID}: RemoveByIDChapterUseCaseInput): Promise<Chapter> {
    return this.repository.removeByID(ID.create({value: id}), ID.create({value: bookID}))
  }
}
