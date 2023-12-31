import {ID} from '../../_kernel/ID.js'
import {Link} from '../Models/Link.js'
import {Links} from '../Models/Links.js'

export interface LinkRepository {
  create: (link: Link) => Promise<Link>
  findByID: (id: ID) => Promise<Link>
  findAll: (from: ID) => Promise<Links>
}
