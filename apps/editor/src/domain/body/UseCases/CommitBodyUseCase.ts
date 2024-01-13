import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {LocalStorageBodyRepository} from '../Repositories/LocalStorageBodyRepository'

export interface CommitBodyUseCaseInput {
  id: string
  content: string
  chapterID: string
  userID: string
  bookID: string
}

export class CommitBodyUseCase implements UseCase<CommitBodyUseCaseInput, Body> {
  static create() {
    return new CommitBodyUseCase(LocalStorageBodyRepository.create())
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({id, content, chapterID, userID, bookID}: CommitBodyUseCaseInput): Promise<Body> {
    return this.repository.save(
      Body.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        bookID: ID.create({value: bookID}),
        chapterID: ID.create({value: chapterID}),
        content
      })
    )
  }
}
