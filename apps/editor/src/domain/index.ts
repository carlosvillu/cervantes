/* eslint simple-import-sort/imports: 0 */
import debug from 'debug'

import type {Base} from './_config/index.js'
import {Config} from './_config/index.js'

/** AUTH */
import type {LoginAuthUseCaseInput} from './auth/UseCases/LoginAuthUseCase.js'
import type {AuthTokens} from './auth/Models/AuthTokens.js'

/** USER */
import type {CreateUserUseCaseInput} from './user/UseCases/CreateUserUseCase.js'
import type {User} from './user/Models/User.js'

/** Book */
import type {CreateBookUseCaseInput} from './book/UseCases/CreateBookUseCase.js'
import type {FindByIDBookUseCaseInput} from './book/UseCases/FindByIDBookUseCase.js'
import type {Book} from './book/Models/Book.js'
import type {Books} from './book/Models/Books.js'

/** Chapter */
import type {CreateChapterUseCaseInput} from './chapter/UseCases/CreateChapterUseCase.js'
import type {Chapter} from './chapter/Models/Chapter.js'
import type {FindByIDChapterUseCaseInput} from './chapter/UseCases/FindByIDChapterUseCase.js'
import type {GetAllChapterUseCaseInput} from './chapter/UseCases/GetAllChapterUseCase.js'
import type {Chapters} from './chapter/Models/Chapters.js'

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
  get LogoutAuthUseCase() {return this.#getter<void, AuthTokens>(async () => import('./auth/UseCases/LogoutAuthUseCase.js'), 'LogoutAuthUseCase')} // eslint-disable-line 
  get LoginAuthUseCase() {return this.#getter<LoginAuthUseCaseInput, AuthTokens>(async () => import('./auth/UseCases/LoginAuthUseCase.js'), 'LoginAuthUseCase')} // eslint-disable-line 

  /** USER */
  get CreateUserUseCase() {return this.#getter<CreateUserUseCaseInput, User>(async () => import('./user/UseCases/CreateUserUseCase.js'), 'CreateUserUseCase')} // eslint-disable-line 
  get CurrentUserUseCase() {return this.#getter<void, User>(async () => import('./user/UseCases/CurrentUserUseCase.js'), 'CurrentUserUseCase')} // eslint-disable-line 

  /** Book */
  get FindByIDBookUseCase() {return this.#getter<FindByIDBookUseCaseInput, Book>(async () => import('./book/UseCases/FindByIDBookUseCase.js'), 'FindByIDBookUseCase')} // eslint-disable-line 
  get CreateBookUseCase() {return this.#getter<CreateBookUseCaseInput, Book>(async () => import('./book/UseCases/CreateBookUseCase.js'), 'CreateBookUseCase')} // eslint-disable-line 
  get GetAllBookUseCase() {return this.#getter<void, Books>(async () => import('./book/UseCases/GetAllBookUseCase.js'), 'GetAllBookUseCase')} // eslint-disable-line 


  /** Chapter */
  get CreateChapterUseCase() {return this.#getter<CreateChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/CreateChapterUseCase.js'), 'CreateChapterUseCase')} // eslint-disable-line 
  get FindByIDChapterUseCase() {return this.#getter<FindByIDChapterUseCaseInput, Chapter>(async () => import('./chapter/UseCases/FindByIDChapterUseCase.js'), 'FindByIDChapterUseCase')} // eslint-disable-line 
  get GetAllChapterUseCase() {return this.#getter<GetAllChapterUseCaseInput, Chapters>(async () => import('./chapter/UseCases/GetAllChapterUseCase.js'), 'GetAllChapterUseCase')} // eslint-disable-line 

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
