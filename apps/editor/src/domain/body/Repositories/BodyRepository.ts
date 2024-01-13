import {ID} from '../../_kernel/ID'
import {Body} from '../Models/Body'

export interface BodyRepository {
  save: (body: Body) => Promise<Body>
  findOneBy: (userID: ID, bookID: ID, chapterID: ID) => Promise<Body>
}
