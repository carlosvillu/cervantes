import {Cache, CacheConfig} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapter} from '../Models/Chapter.js'
import {ChapterRepository} from '../Repository/ChapterRepository.js'
import {HTTPChapterRepository} from '../Repository/HTTPChapterRepository.js'

export interface GetRootChapterUseCaseInput {
  bookID: string
}

export class GetRootChapterUseCase implements UseCase<GetRootChapterUseCaseInput, Chapter> {
  static create({config}: {config: Config}) {
    return new GetRootChapterUseCase(HTTPChapterRepository.create(config))
  }

  constructor(private readonly repository: ChapterRepository) {}

  @Cache({
    name: 'GetRootChapterUseCase',
    ttl: Number.MAX_SAFE_INTEGER,
    references(_args, _key, result) {
      return ['chapter:' + result.id]
    }
  } as const as CacheConfig<Chapter>)
  async execute({bookID}: GetRootChapterUseCaseInput): Promise<Chapter> {
    return this.repository.getRootChapter(ID.create({value: bookID}))
  }
}
