import {Cache, CacheConfig} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapters} from '../Models/Chapters.js'
import {ChapterRepository} from '../Repository/ChapterRepository.js'
import {HTTPChapterRepository} from '../Repository/HTTPChapterRepository.js'

export interface GetAllChapterUseCaseInput {
  bookID: string
}

export class GetAllChapterUseCase implements UseCase<GetAllChapterUseCaseInput, Chapters> {
  static create({config}: {config: Config}) {
    return new GetAllChapterUseCase(HTTPChapterRepository.create(config))
  }

  constructor(private readonly repository: ChapterRepository) {}

  @Cache({
    name: 'GetAllChapterUseCase',
    ttl: Number.MAX_SAFE_INTEGER,
    references(args: GetAllChapterUseCaseInput, _key, _result) {
      return ['chapter:all:' + args.bookID]
    }
  } as const as CacheConfig<Chapters>)
  async execute({bookID}: GetAllChapterUseCaseInput): Promise<Chapters> {
    return this.repository.findAll(ID.create({value: bookID}))
  }
}
