import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {Bodies} from '../Models/Bodies.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {RedisBodyRepository} from '../Repositories/RedisBodyRepository/index.js'

export interface GetLastCommitBodyUseCaseInput {
  userID: string
  bookID: string
  chapterID: string
}

export class GetLastCommitBodyUseCase implements UseCase<GetLastCommitBodyUseCaseInput, Body> {
  static create() {
    return new GetLastCommitBodyUseCase(RedisBodyRepository.create())
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({userID, bookID, chapterID}: GetLastCommitBodyUseCaseInput): Promise<Body> {
    const bodies = await this.repository.findAll(
      ID.create({value: userID}),
      ID.create({value: bookID}),
      ID.create({value: chapterID})
    )

    if (bodies.isEmpty()) return Body.empty()

    const body = bodies.toJSON().bodies[0]

    return Body.create(body)
  }
}
