/* eslint simple-import-sort/imports: 0 */
import debug from 'debug'

import type {Base} from './_config/index.js'
import {Config} from './_config/index.js'
import {DomainError} from './_kernel/DomainError.js'

/** AUTH */
import type {ValidationToken} from './auth/Models/ValidationToken.js'
import type {AuthTokens} from './auth/Models/AuthTokens.js'
import type {CreateTokenAuthUseCaseInput} from './auth/UseCases/CreateTokenAuthUseCase.js'
import type {VerifyRefreshTokenAuthUseCaseInput} from './auth/UseCases/VerifyRefreshTokenAuthUseCase.js'
import type {RemoveUserTokenAuthUseCaseInput} from './auth/UseCases/RemoveUserTokenAuthUseCase.js'
import type {SendValidationCodeAuthUseCaseInput} from './auth/UseCases/SendValidationCodeAuthUseCase.js'
import type {CheckValidationTokenAuthUseCaseInput} from './auth/UseCases/CheckValidationTokenAuthUseCase.js'
import type {FindByIDValidationTokenAuthUseCaseInput} from './auth/UseCases/FindByIDValidationTokenAuthUseCase.js'
import type {ValidationStatus} from './auth/Models/ValidationStatus.js'

/** User */
import type {FindOneUserUseCaseInput} from './user/UseCases/FindOneUserUseCase.js'
import type {CreateUserUseCaseInput} from './user/UseCases/CreateUserUseCase.js'
import type {VerifyEmailAndPasswordUserUseCaseInput} from './user/UseCases/VerifyEmailAndPasswordUserUseCase.js'
import type {FindByIDUserUseCaseInput} from './user/UseCases/FindByIDUserUseCase.js'
import type {User} from './user/Models/User.js'

/** Book */
import type {CreateBookUseCaseInput} from './book/UseCases/CreateBookUseCase.js'
import type {UpdateBookUseCaseInput} from './book/UseCases/UpdateBookUseCase.js'
import type {Book} from './book/Models/Book.js'
import type {GetAllBookUseCaseInput} from './book/UseCases/GetAllBookUseCase.js'
import type {Books} from './book/Models/Books.js'
import type {FindByIDBookUseCaseInput} from './book/UseCases/FindByIDBookUseCase.js'

/** Chapter */
import type {FindByIDChapterUseCaseInput} from './chapter/UseCases/FindByIDChapterUseCase.js'
import type {RemoveByIDChapterUseCaseInput} from './chapter/UseCases/RemoveByIDChapterUseCase.js'
import type {GetAllChapterUseCaseInput} from './chapter/UseCases/GetAllChapterUseCase.js'
import type {CreateChapterUseCaseInput} from './chapter/UseCases/CreateChapterUseCase.js'
import type {UpdateChapterUseCaseInput} from './chapter/UseCases/UpdateChapterUseCase.js'
import type {Chapter} from './chapter/Models/Chapter.js'
import type {Chapters} from './chapter/Models/Chapters.js'

/** Link */
import type {Link} from './link/Models/Link.js'
import type {Links} from './link/Models/Links.js'
import type {FindByIDLinkUseCaseInput} from './link/UseCases/FindByIDLinkUseCase.js'
import type {CreateLinkUseCaseInput} from './link/UseCases/CreateLinkUseCase.js'
import type {GetAllLinkUseCaseInput} from './link/UseCases/GetAllLinkUseCase.js'
import type {RemoveByIDLinkUseCaseInput} from './link/UseCases/RemoveByIDLinkUseCase.js'
import type {RemoveByChapterIDLinkUseCaseInput} from './link/UseCases/RemoveByChapterIDLinkUseCase.js'

/** Body */
import type {GetAllBodyUseCaseInput} from './body/UseCases/GetAllBodyUseCase.js'
import type {FindByIDBodyUseCaseInput} from './body/UseCases/FindByIDBodyUseCase.js'
import type {AddBodyUseCaseInput} from './body/UseCases/AddBodyUseCase.js'
import type {Body} from './body/Models/Body.js'
import type {Bodies} from './body/Models/Bodies.js'
import type {FindByHashBodyUseCaseInput} from './body/UseCases/FindByHashBodyUseCase.js'
import type {RemoveByChapterIDBodyUseCaseInput} from './body/UseCases/RemoveByChapterIDBodyUseCase.js'

const log = debug('cervantes:api:domain:entrypoint')

export class Domain {
  #config: Config

  static create(config: Base) {
    log('Create Domain...')
    return new Domain(config)
  }

  constructor(config: Base) {
    this.#config = Config.create(config)
  }

  get config() {
    return this.#config
  }

  /** AUTH */
  get CreateTokenAuthUseCase() {return this.#getter<CreateTokenAuthUseCaseInput, AuthTokens>(async () => import('./auth/UseCases/CreateTokenAuthUseCase.js'), 'CreateTokenAuthUseCase')} // eslint-disable-line 
  get VerifyRefreshTokenAuthUseCase() {return this.#getter<VerifyRefreshTokenAuthUseCaseInput, AuthTokens>(async () => import('./auth/UseCases/VerifyRefreshTokenAuthUseCase.js'), 'VerifyRefreshTokenAuthUseCase')} // eslint-disable-line 
  get RemoveUserTokenAuthUseCase() {return this.#getter<RemoveUserTokenAuthUseCaseInput, AuthTokens>(async () => import('./auth/UseCases/RemoveUserTokenAuthUseCase.js'), 'RemoveUserTokenAuthUseCase')} // eslint-disable-line 
  get SendValidationCodeAuthUseCase() {return this.#getter<SendValidationCodeAuthUseCaseInput, ValidationToken>(async () => import('./auth/UseCases/SendValidationCodeAuthUseCase.js'), 'SendValidationCodeAuthUseCase')} // eslint-disable-line 
  get CheckValidationTokenAuthUseCase() {return this.#getter<CheckValidationTokenAuthUseCaseInput, ValidationStatus>(async () => import('./auth/UseCases/CheckValidationTokenAuthUseCase.js'), 'CheckValidationTokenAuthUseCase')} // eslint-disable-line 
  get FindByIDValidationTokenAuthUseCase() {return this.#getter<FindByIDValidationTokenAuthUseCaseInput, ValidationToken>(async () => import('./auth/UseCases/FindByIDValidationTokenAuthUseCase.js'), 'FindByIDValidationTokenAuthUseCase')} // eslint-disable-line 

  /** User */
  get FindByIDUserUseCase() {return this.#getter<FindByIDUserUseCaseInput, User>(async () => import('./user/UseCases/FindByIDUserUseCase.js'), 'FindByIDUserUseCase')} // eslint-disable-line 
  get FindOneUserUseCase() {return this.#getter<FindOneUserUseCaseInput, User>(async () => import('./user/UseCases/FindOneUserUseCase.js'), 'FindOneUserUseCase')} // eslint-disable-line 
  get CreateUserUseCase() {return this.#getter<CreateUserUseCaseInput, User>(async () => import('./user/UseCases/CreateUserUseCase.js'), 'CreateUserUseCase')} // eslint-disable-line 
  get VerifyEmailAndPasswordUserUseCase() {return this.#getter<VerifyEmailAndPasswordUserUseCaseInput, User>(async () => import('./user/UseCases/VerifyEmailAndPasswordUserUseCase.js'), 'VerifyEmailAndPasswordUserUseCase')} // eslint-disable-line 

  /** BOOK */
  get CreateBookUseCase() {return this.#getter<CreateBookUseCaseInput, Book>(async () => import('./book/UseCases/CreateBookUseCase.js'), 'CreateBookUseCase')} // eslint-disable-line 
  get UpdateBookUseCase() {return this.#getter<UpdateBookUseCaseInput, Book>(async () => import('./book/UseCases/UpdateBookUseCase.js'), 'UpdateBookUseCase')} // eslint-disable-line 
  get GetAllBookUseCase() {return this.#getter<GetAllBookUseCaseInput, Books>(async () => import('./book/UseCases/GetAllBookUseCase.js'), 'GetAllBookUseCase')} // eslint-disable-line 
  get FindByIDBookUseCase() {return this.#getter<FindByIDBookUseCaseInput, Book>(async () => import('./book/UseCases/FindByIDBookUseCase.js'), 'FindByIDBookUseCase')} // eslint-disable-line 

  /** Chapter */
  get FindByIDChapterUseCase() {return this.#getter<FindByIDChapterUseCaseInput, Chapters>(async () => import('./chapter/UseCases/FindByIDChapterUseCase.js'), 'FindByIDChapterUseCase')} // eslint-disable-line 
  get RemoveByIDChapterUseCase() {return this.#getter<RemoveByIDChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/RemoveByIDChapterUseCase.js'), 'RemoveByIDChapterUseCase')} // eslint-disable-line 
  get GetAllChapterUseCase() {return this.#getter<GetAllChapterUseCaseInput, Chapters>(async () => import('./chapter/UseCases/GetAllChapterUseCase.js'), 'GetAllChapterUseCase')} // eslint-disable-line 
  get CreateChapterUseCase() {return this.#getter<CreateChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/CreateChapterUseCase.js'), 'CreateChapterUseCase')} // eslint-disable-line 
  get UpdateChapterUseCase() {return this.#getter<UpdateChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/UpdateChapterUseCase.js'), 'UpdateChapterUseCase')} // eslint-disable-line 

  /** Link */
  get FindByIDLinkUseCase() {return this.#getter<FindByIDLinkUseCaseInput, Link>(async () => import('./link/UseCases/FindByIDLinkUseCase.js'), 'FindByIDLinkUseCase')} // eslint-disable-line 
  get CreateLinkUseCase() {return this.#getter<CreateLinkUseCaseInput, Link | DomainError>(async () => import('./link/UseCases/CreateLinkUseCase.js'), 'CreateLinkUseCase')} // eslint-disable-line 
  get GetAllLinkUseCase() {return this.#getter<GetAllLinkUseCaseInput, Links>(async () => import('./link/UseCases/GetAllLinkUseCase.js'), 'GetAllLinkUseCase')} // eslint-disable-line 
  get RemoveByIDLinkUseCase() {return this.#getter<RemoveByIDLinkUseCaseInput, Links>(async () => import('./link/UseCases/RemoveByIDLinkUseCase.js'), 'RemoveByIDLinkUseCase')} // eslint-disable-line 
  get RemoveByChapterIDLinkUseCase() {return this.#getter<RemoveByChapterIDLinkUseCaseInput, Links>(async () => import('./link/UseCases/RemoveByChapterIDLinkUseCase.js'), 'RemoveByChapterIDLinkUseCase')} // eslint-disable-line 

  /** Body */
  get AddBodyUseCase() {return this.#getter<AddBodyUseCaseInput, Body>(async () => import('./body/UseCases/AddBodyUseCase.js'), 'AddBodyUseCase')} // eslint-disable-line 
  get FindByIDBodyUseCase() {return this.#getter<FindByIDBodyUseCaseInput, Body>(async () => import('./body/UseCases/FindByIDBodyUseCase.js'), 'FindByIDBodyUseCase')} // eslint-disable-line 
  get GetAllBodyUseCase() {return this.#getter<GetAllBodyUseCaseInput, Bodies>(async () => import('./body/UseCases/GetAllBodyUseCase.js'), 'GetAllBodyUseCase')} // eslint-disable-line 
  get FindByHashBodyUseCase() {return this.#getter<FindByHashBodyUseCaseInput, Bodies>(async () => import('./body/UseCases/FindByHashBodyUseCase.js'), 'FindByHashBodyUseCase')} // eslint-disable-line 
  get RemoveByChapterIDBodyUseCase() {return this.#getter<RemoveByChapterIDBodyUseCaseInput, Bodies>(async () => import('./body/UseCases/RemoveByChapterIDBodyUseCase.js'), 'RemoveByChapterIDBodyUseCase')} // eslint-disable-line 

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
