/* eslint simple-import-sort/imports: 0 */
import debug from 'debug'

import type {Base} from './_config/index.js'
import {Config} from './_config/index.js'
import {DomainError} from './_kernel/DomainError.js'

/** AUTH */
import type {LoginAuthUseCaseInput} from './auth/UseCases/LoginAuthUseCase.js'
import type {AuthTokens} from './auth/Models/AuthTokens.js'
import type {ValidationToken} from './auth/Models/ValidationToken.js'
import type {CheckValidationTokenAuthUseCaseInput} from './auth/UseCases/CheckValidationTokenAuthUseCase.js'
import type {ValidationStatus} from './auth/Models/ValidationStatus.js'
import type {FindByIDValidationTokenAuthUseCaseInput} from './auth/UseCases/FindByIDValidationTokenAuthUseCase.js'

/** USER */
import type {CreateUserUseCaseInput} from './user/UseCases/CreateUserUseCase.js'
import type {User} from './user/Models/User.js'

/** Book */
import type {CreateBookUseCaseInput} from './book/UseCases/CreateBookUseCase.js'
import type {UpdateBookUseCaseInput} from './book/UseCases/UpdateBookUseCase.js'
import type {FindByIDBookUseCaseInput} from './book/UseCases/FindByIDBookUseCase.js'
import type {Book} from './book/Models/Book.js'
import type {Books} from './book/Models/Books.js'

/** Chapter */
import type {CreateChapterUseCaseInput} from './chapter/UseCases/CreateChapterUseCase.js'
import type {RemoveByIDChapterUseCaseInput} from './chapter/UseCases/RemoveByIDChapterUseCase.js'
import type {UpdateChapterUseCaseInput} from './chapter/UseCases/UpdateChapterUseCase.js'
import type {Chapter} from './chapter/Models/Chapter.js'
import type {FindByIDChapterUseCaseInput} from './chapter/UseCases/FindByIDChapterUseCase.js'
import type {GetAllChapterUseCaseInput} from './chapter/UseCases/GetAllChapterUseCase.js'
import type {Chapters} from './chapter/Models/Chapters.js'

/** Link */
import type {Link} from './link/Models/Link.js'
import type {Links} from './link/Models/Links.js'
import type {GetAllLinkUseCaseInput} from './link/UseCases/GetAllLinkUseCase.js'
import type {FindByIDLinkUseCaseInput} from './link/UseCases/FindByIDLinkUseCase.js'
import type {CreateLinkUseCaseInput} from './link/UseCases/CreateLinkUseCase.js'
import type {RemoveByIDLinkUseCaseInput} from './link/UseCases/RemoveByIDLinkUseCase.js'

/** Body */
import type {Body} from './body/Models/Body.js'
import type {CommitBodyUseCaseInput} from './body/UseCases/CommitBodyUseCase.js'
import type {GetLastCommitBodyUseCaseInput} from './body/UseCases/GetLastCommitBodyUseCase.js'
import type {GetLastBodyUseCaseInput} from './body/UseCases/GetLastBodyUseCase.js'
import type {SaveBodyUseCaseInput} from './body/UseCases/SaveBodyUseCase.js'

/** Statics */
import type {UploadImageStaticsUseCaseInput} from './statics/UseCases/UploadImageStaticsUseCase.js'
import type {UploadImageResult} from './statics/Models/UploadImageResult.js'

/** Image */
import type {GenerateFromPromptImageUseCaseInput} from './image/UseCases/GenerateFromPromptImageUseCase.js'
import type {DeleteBookCoverByBookIDImageUseCaseInput} from './image/UseCases/DeleteBookCoverByBookIDImageUseCase.js'
import type {DeleteChapterCoverByChapterIDImageUseCaseInput} from './image/UseCases/DeleteChapterCoverByChapterIDImageUseCase.js'
import type {CreateBookCoverImageUseCaseInput} from './image/UseCases/CreateBookCoverImageUseCase.js'
import type {CreateChapterCoverImageUseCaseInput} from './image/UseCases/CreateChapterCoverImageUseCase.js'
import type {FindBookCoverByBookIDImageUseCaseInput} from './image/UseCases/FindBookCoverByBookIDImageUseCase.js'
import type {FindChapterCoverByChapterIDImageUseCaseInput} from './image/UseCases/FindChapterCoverByChapterIDImageUseCase.js'
import type {BookCover} from './image/Models/BookCover.js'
import type {ChapterCover} from './image/Models/ChapterCover.js'
import {ImagesURLs} from './image/Models/ImagesURLs.js'

const log = debug('cervantes:editor:domain:entrypoint')

export class Domain {
  #config: Config

  static create(config: Base) {
    log('Domain Created with config %j', config)
    return new Domain(config)
  }

  constructor(config: Base) {
    this.#config = Config.create(config)
  }

  get config() {
    return this.#config
  }

  /** AUTH */
  get CreateValidationTokenAuthUseCase() {return this.#getter<void, ValidationToken>(async () => import('./auth/UseCases/CreateValidationTokenAuthUseCase.js'), 'CreateValidationTokenAuthUseCase')} // eslint-disable-line 
  get CheckValidationTokenAuthUseCase() {return this.#getter<CheckValidationTokenAuthUseCaseInput, ValidationStatus>(async () => import('./auth/UseCases/CheckValidationTokenAuthUseCase.js'), 'CheckValidationTokenAuthUseCase')} // eslint-disable-line 
  get FindByIDValidationTokenAuthUseCase() {return this.#getter<FindByIDValidationTokenAuthUseCaseInput, ValidationToken>(async () => import('./auth/UseCases/FindByIDValidationTokenAuthUseCase.js'), 'FindByIDValidationTokenAuthUseCase')} // eslint-disable-line 
  get LogoutAuthUseCase() {return this.#getter<void, AuthTokens>(async () => import('./auth/UseCases/LogoutAuthUseCase.js'), 'LogoutAuthUseCase')} // eslint-disable-line
  get LoginAuthUseCase() {return this.#getter<LoginAuthUseCaseInput, AuthTokens>(async () => import('./auth/UseCases/LoginAuthUseCase.js'), 'LoginAuthUseCase')} // eslint-disable-line

  /** USER */
  get CreateUserUseCase() {return this.#getter<CreateUserUseCaseInput, User | DomainError>(async () => import('./user/UseCases/CreateUserUseCase.js'), 'CreateUserUseCase')} // eslint-disable-line
  get CurrentUserUseCase() {return this.#getter<void, User | DomainError>(async () => import('./user/UseCases/CurrentUserUseCase.js'), 'CurrentUserUseCase')} // eslint-disable-line

  /** Book */
  get FindByIDBookUseCase() {return this.#getter<FindByIDBookUseCaseInput, Book>(async () => import('./book/UseCases/FindByIDBookUseCase.js'), 'FindByIDBookUseCase')} // eslint-disable-line
  get CreateBookUseCase() {return this.#getter<CreateBookUseCaseInput, Book>(async () => import('./book/UseCases/CreateBookUseCase.js'), 'CreateBookUseCase')} // eslint-disable-line

  get UpdateBookUseCase() {return this.#getter<UpdateBookUseCaseInput, Book>(async () => import('./book/UseCases/UpdateBookUseCase.js'), 'UpdateBookUseCase')} // eslint-disable-line
  get GetAllBookUseCase() {return this.#getter<void, Books>(async () => import('./book/UseCases/GetAllBookUseCase.js'), 'GetAllBookUseCase')} // eslint-disable-line

  /** Chapter */
  get CreateChapterUseCase() {return this.#getter<CreateChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/CreateChapterUseCase.js'), 'CreateChapterUseCase')} // eslint-disable-line
  get RemoveByIDChapterUseCase() {return this.#getter<RemoveByIDChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/RemoveByIDChapterUseCase.js'), 'RemoveByIDChapterUseCase')} // eslint-disable-line
  get UpdateChapterUseCase() {return this.#getter<UpdateChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/UpdateChapterUseCase.js'), 'UpdateChapterUseCase')} // eslint-disable-line
  get FindByIDChapterUseCase() {return this.#getter<FindByIDChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/FindByIDChapterUseCase.js'), 'FindByIDChapterUseCase')} // eslint-disable-line
  get GetAllChapterUseCase() {return this.#getter<GetAllChapterUseCaseInput, Chapters>(async () => import('./chapter/UseCases/GetAllChapterUseCase.js'), 'GetAllChapterUseCase')} // eslint-disable-line

  /** Link */
  get GetAllLinkUseCase() {return this.#getter<GetAllLinkUseCaseInput, Links>(async () => import('./link/UseCases/GetAllLinkUseCase.js'), 'GetAllLinkUseCase')} // eslint-disable-line
  get FindByIDLinkUseCase() {return this.#getter<FindByIDLinkUseCaseInput, Link>(async () => import('./link/UseCases/FindByIDLinkUseCase.js'), 'FindByIDLinkUseCase')} // eslint-disable-line
  get CreateLinkUseCase() {return this.#getter<CreateLinkUseCaseInput, Link>(async () => import('./link/UseCases/CreateLinkUseCase.js'), 'CreateLinkUseCase')} // eslint-disable-line

  get RemoveByIDLinkUseCase() {return this.#getter<RemoveByIDLinkUseCaseInput, Link>(async () => import('./link/UseCases/RemoveByIDLinkUseCase.js'), 'RemoveByIDLinkUseCase')} // eslint-disable-line

  /** Body */
  get CommitBodyUseCase() {return this.#getter<CommitBodyUseCaseInput, Body>(async () => import('./body/UseCases/CommitBodyUseCase.js'), 'CommitBodyUseCase')} // eslint-disable-line
  get GetLastCommitBodyUseCase() {return this.#getter<GetLastCommitBodyUseCaseInput, Body>(async () => import('./body/UseCases/GetLastCommitBodyUseCase.js'), 'GetLastCommitBodyUseCase')} // eslint-disable-line
  get GetLastBodyUseCase() {return this.#getter<GetLastBodyUseCaseInput, Body>(async () => import('./body/UseCases/GetLastBodyUseCase.js'), 'GetLastBodyUseCase')} // eslint-disable-line
  get SaveBodyUseCase() {return this.#getter<SaveBodyUseCaseInput, Body>(async () => import('./body/UseCases/SaveBodyUseCase.js'), 'SaveBodyUseCase')} // eslint-disable-line

  /** Statics */
  get UploadImageStaticsUseCase() {return this.#getter<UploadImageStaticsUseCaseInput, UploadImageResult>(async () => import('./statics/UseCases/UploadImageStaticsUseCase.js'), 'UploadImageStaticsUseCase')} // eslint-disable-line

  /** Image */
  get GenerateFromPromptImageUseCase() {return this.#getter<GenerateFromPromptImageUseCaseInput, ImagesURLs>(async () => import('./image/UseCases/GenerateFromPromptImageUseCase.js'), 'GenerateFromPromptImageUseCase')} // eslint-disable-line
  get DeleteBookCoverByBookIDImageUseCase() {return this.#getter<DeleteBookCoverByBookIDImageUseCaseInput, BookCover>(async () => import('./image/UseCases/DeleteBookCoverByBookIDImageUseCase.js'), 'DeleteBookCoverByBookIDImageUseCase')} // eslint-disable-line
  get DeleteChapterCoverByChapterIDImageUseCase() {return this.#getter<DeleteChapterCoverByChapterIDImageUseCaseInput, ChapterCover>(async () => import('./image/UseCases/DeleteChapterCoverByChapterIDImageUseCase.js'), 'DeleteChapterCoverByChapterIDImageUseCase')} // eslint-disable-line
  get CreateBookCoverImageUseCase() {return this.#getter<CreateBookCoverImageUseCaseInput, BookCover>(async () => import('./image/UseCases/CreateBookCoverImageUseCase.js'), 'CreateBookCoverImageUseCase')} // eslint-disable-line
  get CreateChapterCoverImageUseCase() {return this.#getter<CreateChapterCoverImageUseCaseInput, ChapterCover>(async () => import('./image/UseCases/CreateChapterCoverImageUseCase.js'), 'CreateChapterCoverImageUseCase')} // eslint-disable-line
  get FindBookCoverByBookIDImageUseCase() {return this.#getter<FindBookCoverByBookIDImageUseCaseInput, BookCover>(async () => import('./image/UseCases/FindBookCoverByBookIDImageUseCase.js'), 'FindBookCoverByBookIDImageUseCase')} // eslint-disable-line
  get FindChapterCoverByChapterIDImageUseCase() {return this.#getter<FindChapterCoverByChapterIDImageUseCaseInput, ChapterCover>(async () => import('./image/UseCases/FindChapterCoverByChapterIDImageUseCase.js'), 'FindChapterCoverByChapterIDImageUseCase')} // eslint-disable-line

  #getter<I, O>(loader: Function, name: string) {
    return {
      execute: async (input: I): Promise<O> => {
        // @ts-expect-error
        const Klass = await loader().then(mod => mod[name])
        const uc = Klass.create({config: this.#config})

        return uc.execute(input) as O
      }
    }
  }
}
