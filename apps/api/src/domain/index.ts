/* eslint simple-import-sort/imports: 0 */
import debug from 'debug'

import type {Base} from './_config/index.js'
import {Config} from './_config/index.js'

/** AUTH */
import type {AuthTokens} from './auth/Models/AuthTokens.js'
import type {CreateTokenAuthUseCaseInput} from './auth/UseCases/CreateTokenAuthUseCase.js'
import type {VerifyRefreshTokenAuthUseCaseInput} from './auth/UseCases/VerifyRefreshTokenAuthUseCase.js'
import type {RemoveUserTokenAuthUseCaseInput} from './auth/UseCases/RemoveUserTokenAuthUseCase.js'

/** User */
import type {FindOneUserUseCaseInput} from './user/UseCases/FindOneUserUseCase.js'
import type {CreateUserUseCaseInput} from './user/UseCases/CreateUserUseCase.js'
import type {VerifyEmailAndPasswordUserUseCaseInput} from './user/UseCases/VerifyEmailAndPasswordUserUseCase.js'
import type {FindByIDUserUseCaseInput} from './user/UseCases/FindByIDUserUseCase.js'
import type {User} from './user/Models/User.js'

/** Book */
import type {CreateBookUseCaseInput} from './book/UseCases/CreateBookUseCase.js'
import type {Book} from './book/Models/Book.js'
import type {GetAllBookUseCaseInput} from './book/UseCases/GetAllBookUseCase.js'
import type {Books} from './book/Models/Books.js'
import type {FindByIDBookUseCaseInput} from './book/UseCases/FindByIDBookUseCase.js'

/** Chapter */
import type {FindByIDChapterUseCaseInput} from './chapter/UseCases/FindByIDChapterUseCase.js'
import type {GetAllChapterUseCaseInput} from './chapter/UseCases/GetAllChapterUseCase.js'
import type {CreateChapterUseCaseInput} from './chapter/UseCases/CreateChapterUseCase.js'
import type {Chapter} from './chapter/Models/Chapter.js'
import type {Chapters} from './chapter/Models/Chapters.js'

/** Link */
import type {Link} from './link/Models/Link.js'
import type {Links} from './link/Models/Links.js'
import type {FindByIDLinkUseCaseInput} from './link/UseCases/FindByIDLinkUseCase.js'
import type {CreateLinkUseCaseInput} from './link/UseCases/CreateLinkUseCase.js'
import type {GetAllLinkUseCaseInput} from './link/UseCases/GetAllLinkUseCase.js'

/** Body */
import type {GetAllBodyUseCaseInput} from './body/UseCases/GetAllBodyUseCase.js'
import type {FindByIDBodyUseCaseInput} from './body/UseCases/FindByIDBodyUseCase.js'
import type {AddBodyUseCaseInput} from './body/UseCases/AddBodyUseCase.js'
import type {Body} from './body/Models/Body.js'
import type {Bodies} from './body/Models/Bodies.js'
import type {FindByHashBodyUseCaseInput} from './body/UseCases/FindByHashUseCase.js'

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

  /** User */
  get FindByIDUserUseCase() {return this.#getter<FindByIDUserUseCaseInput, User>(async () => import('./user/UseCases/FindByIDUserUseCase.js'), 'FindByIDUserUseCase')} // eslint-disable-line 
  get FindOneUserUseCase() {return this.#getter<FindOneUserUseCaseInput, User>(async () => import('./user/UseCases/FindOneUserUseCase.js'), 'FindOneUserUseCase')} // eslint-disable-line 
  get CreateUserUseCase() {return this.#getter<CreateUserUseCaseInput, User>(async () => import('./user/UseCases/CreateUserUseCase.js'), 'CreateUserUseCase')} // eslint-disable-line 
  get VerifyEmailAndPasswordUserUseCase() {return this.#getter<VerifyEmailAndPasswordUserUseCaseInput, User>(async () => import('./user/UseCases/VerifyEmailAndPasswordUserUseCase.js'), 'VerifyEmailAndPasswordUserUseCase')} // eslint-disable-line 

  /** BOOK */
  get CreateBookUseCase() {return this.#getter<CreateBookUseCaseInput, Book>(async () => import('./book/UseCases/CreateBookUseCase.js'), 'CreateBookUseCase')} // eslint-disable-line 
  get GetAllBookUseCase() {return this.#getter<GetAllBookUseCaseInput, Books>(async () => import('./book/UseCases/GetAllBookUseCase.js'), 'GetAllBookUseCase')} // eslint-disable-line 
  get FindByIDBookUseCase() {return this.#getter<FindByIDBookUseCaseInput, Book>(async () => import('./book/UseCases/FindByIDBookUseCase.js'), 'FindByIDBookUseCase')} // eslint-disable-line 

  /** Chapter */
  get FindByIDChapterUseCase() {return this.#getter<FindByIDChapterUseCaseInput, Chapters>(async () => import('./chapter/UseCases/FindByIDChapterUseCase.js'), 'FindByIDChapterUseCase')} // eslint-disable-line 
  get GetAllChapterUseCase() {return this.#getter<GetAllChapterUseCaseInput, Chapters>(async () => import('./chapter/UseCases/GetAllChapterUseCase.js'), 'GetAllChapterUseCase')} // eslint-disable-line 
  get CreateChapterUseCase() {return this.#getter<CreateChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/CreateChapterUseCase.js'), 'CreateChapterUseCase')} // eslint-disable-line 

  /** Link */
  get FindByIDLinkUseCase() {return this.#getter<FindByIDLinkUseCaseInput, Link>(async () => import('./link/UseCases/FindByIDLinkUseCase.js'), 'FindByIDLinkUseCase')} // eslint-disable-line 
  get CreateLinkUseCase() {return this.#getter<CreateLinkUseCaseInput, Link>(async () => import('./link/UseCases/CreateLinkUseCase.js'), 'CreateLinkUseCase')} // eslint-disable-line 
  get GetAllLinkUseCase() {return this.#getter<GetAllLinkUseCaseInput, Links>(async () => import('./link/UseCases/GetAllLinkUseCase.js'), 'GetAllLinkUseCase')} // eslint-disable-line 

  /** Body */
  get AddBodyUseCase() {return this.#getter<AddBodyUseCaseInput, Body>(async () => import('./body/UseCases/AddBodyUseCase.js'), 'AddBodyUseCase')} // eslint-disable-line 
  get FindByIDBodyUseCase() {return this.#getter<FindByIDBodyUseCaseInput, Body>(async () => import('./body/UseCases/FindByIDBodyUseCase.js'), 'FindByIDBodyUseCase')} // eslint-disable-line 
  get GetAllBodyUseCase() {return this.#getter<GetAllBodyUseCaseInput, Bodies>(async () => import('./body/UseCases/GetAllBodyUseCase.js'), 'GetAllBodyUseCase')} // eslint-disable-line 
  get FindByHashBodyUseCase() {return this.#getter<FindByHashBodyUseCaseInput, Bodies>(async () => import('./body/UseCases/FindByHashBodyUseCase.js'), 'FindByHashBodyUseCase')} // eslint-disable-line 

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
