import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Bodies} from '../Models/Bodies.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {RedisBodyRepository} from '../Repositories/RedisBodyRepository/index.js'

export interface GetAllBodyUseCaseInput {
  userID: string
  bookID: string
  chapterID: string
}

export class GetAllBodyUseCase implements UseCase<GetAllBodyUseCaseInput, Bodies> {
  static create() {
    return new GetAllBodyUseCase(RedisBodyRepository.create())
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({userID, bookID, chapterID}: GetAllBodyUseCaseInput): Promise<Bodies> {
    return this.repository.findAll(
      ID.create({value: userID}),
      ID.create({value: bookID}),
      ID.create({value: chapterID})
    )
  }
}
