import {ID} from '../../_kernel/ID'
import {TimeStamp} from '../../_kernel/TimeStamp'
import {Body, BodyJSON} from '../Models/Body'
import type {BodyRepository} from './BodyRepository'

export class LocalStorageBodyRepository implements BodyRepository {
  static __BOOKADVENTURES_DB__ = '__BOOKADVENTURES_BODIES__'
  static create() {
    return new LocalStorageBodyRepository()
  }

  async findOneBy(userID: ID, bookID: ID, chapterID: ID): Promise<Body> {
    const DBJSON = window.localStorage.getItem(LocalStorageBodyRepository.__BOOKADVENTURES_DB__) ?? '{}'

    if (!DBJSON) return Body.empty()

    const DB = JSON.parse(DBJSON)

    const bodyJSON = DB[userID.value]?.[bookID.value]?.[chapterID.value]?.body as BodyJSON

    if (!bodyJSON) return Body.empty()

    return Body.create({
      id: ID.create({value: bodyJSON.id}),
      userID: ID.create({value: bodyJSON.userID}),
      bookID: ID.create({value: bodyJSON.bookID}),
      chapterID: ID.create({value: bodyJSON.chapterID}),
      createdAt: TimeStamp.create({value: bodyJSON.createdAt}),
      content: bodyJSON.content
    })
  }

  async save(body: Body): Promise<Body> {
    const DBJSON = window.localStorage.getItem(LocalStorageBodyRepository.__BOOKADVENTURES_DB__) ?? '{}'

    if (!DBJSON) return Body.empty()
    if (body.isEmpty()) return body

    const DB = JSON.parse(DBJSON)

    DB[body.userID!] = DB[body.userID!] ?? {}
    DB[body.userID!][body.bookID!] = DB[body.userID!][body.bookID!] ?? {}
    DB[body.userID!][body.bookID!][body.chapterID!] = DB[body.userID!][body.bookID!][body.chapterID!] ?? {}

    DB[body.userID!][body.bookID!][body.chapterID!].body = body.toJSON()

    window.localStorage.setItem(LocalStorageBodyRepository.__BOOKADVENTURES_DB__, JSON.stringify(DB))

    return body
  }
}
