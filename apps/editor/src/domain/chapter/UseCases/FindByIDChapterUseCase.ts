import {Cache, CacheConfig} from '@cervantes/decorators'

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
    return new FindByIDChapterUseCase(HTTPChapterRepository.create(config))
  }

  constructor(private readonly repository: ChapterRepository) {}

  @Cache({
    name: 'FindByIDChapterUseCase',
    ttl: Number.MAX_SAFE_INTEGER,
    references(_args, _key, result) {
      return ['chapter:' + result.id]
    }
  } as const as CacheConfig<Chapter>)
  async execute({id, bookID}: FindByIDChapterUseCaseInput): Promise<Chapter> {
    return this.repository.findByID(ID.create({value: id}), ID.create({value: bookID}))
  }
}
