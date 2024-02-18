import debug from 'debug'

import {RemoveByChapterIDBodyUseCase} from '../body/UseCases/RemoveByChapterIDBodyUseCase.js'
import {RemoveByChapterIDLinkUseCase} from '../link/UseCases/RemoveByChapterIDLinkUseCase.js'
import {ValidateEmailByIDUserUseCase} from '../user/UseCases/ValidateEmailByIDUserUseCase.js'
import {Event} from './events.js'

const log = debug('cervantes:api:domain:broker')
let instance: Broker | undefined

export class Broker {
  static create() {
    if (instance) return instance
    instance = new Broker()
    return instance
  }

  async emit(event: Event): Promise<void> {
    log('Starting to handler event %s', event.payload)
    switch (event.type) {
      case 'delete_chapter': {
        const {id, userID} = event.payload
        await RemoveByChapterIDLinkUseCase.create().execute({id: id.value, userID: userID.value})
        await RemoveByChapterIDBodyUseCase.create().execute({id: id.value, userID: userID.value})
        log('Event %s handled successful', event.payload)
        break
      }
      case 'check_validation_token': {
        log('Event %s handled successful', event.payload)

        const {userID, status} = event.payload
        if (!status.isSuccess()) return

        await ValidateEmailByIDUserUseCase.create().execute({id: userID.value})
        break
      }
    }
  }
}
