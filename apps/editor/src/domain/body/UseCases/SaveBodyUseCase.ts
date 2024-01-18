import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {HTTPBodyRepository} from '../Repositories/HTTPBodyRepository'

export interface SaveBodyUseCaseInput {
  id: string
  content: string
  chapterID: string
  userID: string
  bookID: string
}

export class SaveBodyUseCase implements UseCase<SaveBodyUseCaseInput, Body> {
  static create({config}: {config: Config}) {
    return new SaveBodyUseCase(HTTPBodyRepository.create(config))
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({id, content, userID, bookID, chapterID}: SaveBodyUseCaseInput): Promise<Body> {
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
