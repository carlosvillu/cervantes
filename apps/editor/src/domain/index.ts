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

const log = debug('cervantes:editor:domain:entrypoint')

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
  get LogoutAuthUseCase() {return this.#getter<void, AuthTokens>(async () => import('./auth/UseCases/LogoutAuthUseCase.js'), 'LogoutAuthUseCase')} // eslint-disable-line 
  get LoginAuthUseCase() {return this.#getter<LoginAuthUseCaseInput, AuthTokens>(async () => import('./auth/UseCases/LoginAuthUseCase.js'), 'LoginAuthUseCase')} // eslint-disable-line 

  /** USER */
  get CreateUserUseCase() {return this.#getter<CreateUserUseCaseInput, User>(async () => import('./user/UseCases/CreateUserUseCase.js'), 'CreateUserUseCase')} // eslint-disable-line 
  get CurrentUserUseCase() {return this.#getter<void, User>(async () => import('./user/UseCases/CurrentUserUseCase.js'), 'CurrentUserUseCase')} // eslint-disable-line 


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
