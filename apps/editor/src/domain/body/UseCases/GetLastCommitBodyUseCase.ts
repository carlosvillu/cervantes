import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {LocalStorageBodyRepository} from '../Repositories/LocalStorageBodyRepository'

export interface GetLastCommitBodyUseCaseInput {
  chapterID: string
  userID: string
  bookID: string
}

export class GetLastCommitBodyUseCase implements UseCase<GetLastCommitBodyUseCaseInput, Body> {
  static create() {
    return new GetLastCommitBodyUseCase(LocalStorageBodyRepository.create())
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({chapterID, userID, bookID}: GetLastCommitBodyUseCaseInput): Promise<Body> {
    return this.repository.findOneBy(
      ID.create({value: userID}),
      ID.create({value: bookID}),
      ID.create({value: chapterID})
    )
  }
}
