/* eslint simple-import-sort/imports: 0 */
import debug from 'debug'

import type {Base} from './_config/index.js'
import {Config} from './_config/index.js'

/** AUTH */
import type {AuthTokens} from './auth/Models/AuthTokens.js'
import type {CreateTokenAuthUseCaseInput} from './auth/UseCases/CreateTokenAuthUseCase.js'

/** User */
import type {FindOneUserUseCaseInput} from './user/UseCases/FindOneUserUseCase.js'
import type {CreateUserUseCaseInput} from './user/UseCases/CreateUserUseCase.js'
import type {VerifyEmailAndPasswordUserUseCaseInput} from './user/UseCases/VerifyEmailAndPasswordUserUseCase.js'
import type {User} from './user/Models/User.js'

const log = debug('cervantes:domain:entrypoint')

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

  /** User */
  get FindOneUserUseCase() {return this.#getter<FindOneUserUseCaseInput, User>(async () => import('./user/UseCases/FindOneUserUseCase.js'), 'FindOneUserUseCase')} // eslint-disable-line 
  get CreateUserUseCase() {return this.#getter<CreateUserUseCaseInput, User>(async () => import('./user/UseCases/CreateUserUseCase.js'), 'CreateUserUseCase')} // eslint-disable-line 
  get VerifyEmailAndPasswordUserUseCase() {return this.#getter<VerifyEmailAndPasswordUserUseCaseInput, User>(async () => import('./user/UseCases/VerifyEmailAndPasswordUserUseCase.js'), 'VerifyEmailAndPasswordUserUseCase')} // eslint-disable-line 

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
