import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {RedisBodyRepository} from '../Repositories/RedisBodyRepository/index.js'

export interface AddBodyUseCaseInput {
  id: string
  content: string
  chapterID: string
  userID: string
  bookID: string
}

export class AddBodyUseCase implements UseCase<AddBodyUseCaseInput, Body> {
  static create() {
    return new AddBodyUseCase(RedisBodyRepository.create())
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({id, content, chapterID, userID, bookID}: AddBodyUseCaseInput): Promise<Body> {
    return this.repository.create(
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
