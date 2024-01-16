import {ID} from '../../_kernel/ID.js'
import {Bodies} from '../Models/Bodies.js'
import {Body} from '../Models/Body.js'

export interface BodyRepository {
  create: (body: Body) => Promise<Body>
  findAll: (userID: ID, bookID: ID, chapterID: ID) => Promise<Bodies>
  findByID: (id: ID, userID: ID) => Promise<Body>
}
