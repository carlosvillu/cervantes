import {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {HTTPBodyRepository} from '../Repositories/HTTPBodyRepository'

export interface GetLastBodyUseCaseInput {
  chapterID: string
  userID: string
  bookID: string
}

export class GetLastBodyUseCase implements UseCase<GetLastBodyUseCaseInput, Body> {
  static create({config}: {config: Config}) {
    return new GetLastBodyUseCase(HTTPBodyRepository.create(config))
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({chapterID, userID, bookID}: GetLastBodyUseCaseInput): Promise<Body> {
    return this.repository.findOneBy(
      ID.create({value: userID}),
      ID.create({value: bookID}),
      ID.create({value: chapterID})
    )
  }
}
