import debug from 'debug'

import {RemoveByChapterIDBodyUseCase} from '../body/UseCases/RemoveByChapterIDBodyUseCase.js'
import {GetAllChapterUseCase} from '../chapter/UseCases/GetAllChapterUseCase.js'
import {UpdateChapterUseCase} from '../chapter/UseCases/UpdateChapterUseCase.js'
import {RemoveByChapterIDLinkUseCase} from '../link/UseCases/RemoveByChapterIDLinkUseCase.js'
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
      case 'update_chapter_root': {
        const {id, userID, bookID, isRoot} = event.payload

        if (isRoot) {
          const {chapters} = await GetAllChapterUseCase.create().execute({userID: userID.value, bookID: bookID.value})
          const rootChapters = chapters.filter(chapter => chapter.isRoot)
          const prevRootChapter = rootChapters.filter(chapter => chapter.id !== id.value)[0]

          if (prevRootChapter) {
            await UpdateChapterUseCase.create().execute({
              id: String(prevRootChapter.id),
              bookID: String(prevRootChapter.bookID),
              createdAt: String(prevRootChapter.createdAt),
              summary: String(prevRootChapter.summary),
              title: String(prevRootChapter.title),
              userID: String(prevRootChapter.userID),
              isRoot: false
            })
            log('Event %s handled successful', event.payload)
          }
        }
        break
      }
    }
  }
}
