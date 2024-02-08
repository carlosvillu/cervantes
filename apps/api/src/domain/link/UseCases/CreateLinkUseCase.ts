import {z} from 'zod'

import {UseCase} from '../../_kernel/architecture.js'
import {DomainError} from '../../_kernel/DomainError.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {Link, LinkValidations} from '../Models/Link.js'
import {LinkRepository} from '../Repositories/LinkRepository.js'
import {RedisLinkRepository} from '../Repositories/RedisLinkRepository/index.js'

export interface CreateLinkUseCaseInput {
  id: string
  body: string
  from: string
  to: string
  kind: z.infer<typeof LinkValidations>['kind']
  userID: string
  bookID: string
}

export class CreateLinkUseCase implements UseCase<CreateLinkUseCaseInput, Link | DomainError> {
  static create() {
    return new CreateLinkUseCase(RedisLinkRepository.create())
  }

  constructor(private readonly repository: LinkRepository) {}

  async execute({id, body, from, to, kind, userID, bookID}: CreateLinkUseCaseInput): Promise<Link | DomainError> {
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
