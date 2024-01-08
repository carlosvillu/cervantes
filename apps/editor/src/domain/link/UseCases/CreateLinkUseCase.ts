import {z} from 'zod'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {Link, LinkValidations} from '../Models/Link.js'
import {HTTPLinkRepository} from '../Repositories/HTTPLinkRepository'
import {LinkRepository} from '../Repositories/LinkRepository.js'

export interface CreateLinkUseCaseInput {
  id: string
  body: string
  from: string
  to: string
  kind: z.infer<typeof LinkValidations>['kind']
  userID: string
  bookID: string
}

export class CreateLinkUseCase implements UseCase<CreateLinkUseCaseInput, Link> {
  static create({config}: {config: Config}) {
    return new CreateLinkUseCase(HTTPLinkRepository.create(config))
  }

  constructor(private readonly repository: LinkRepository) {}

  async execute({id, body, from, to, kind, userID, bookID}: CreateLinkUseCaseInput): Promise<Link> {
    return this.repository.create(
      Link.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        bookID: ID.create({value: bookID}),
        from: ID.create({value: from}),
        to: ID.create({value: to}),
        body: Body.create({value: body}),
        kind
      })
    )
  }
}
