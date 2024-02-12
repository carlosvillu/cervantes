import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {Book} from '../Models/Book.js'
import {PublishStatus} from '../Models/PublishStatud.js'
import {Summary} from '../Models/Summary.js'
import {Title} from '../Models/Title.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {RedisBookRepository} from '../Repository/RedisBookRepository/index.js'

export interface UpdateBookUseCaseInput {
  title: string
  summary: string
  published: boolean
  id: string
  userID: string
  createdAt: number
}

export class UpdateBookUseCase implements UseCase<UpdateBookUseCaseInput, Book> {
  static create() {
    return new UpdateBookUseCase(RedisBookRepository.create())
  }

  constructor(private readonly repository: BookRepository) {}

  async execute({title, userID, published, summary, id, createdAt}: UpdateBookUseCaseInput): Promise<Book> {
    return this.repository.create(
      Book.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        title: Title.create({value: title}),
        published: PublishStatus.create({value: published}),
        summary: Summary.create({value: summary}),
        createdAt: TimeStamp.create({value: +createdAt})
      })
    )
  }
}
