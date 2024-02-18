import {ID} from '../../_kernel/ID.js'
import {Email} from '../Models/Email.js'
import {PlainPassword} from '../Models/PlainPassword.js'
import {User} from '../Models/User.js'

export interface UserRepository {
  findOneByEmail: (email: Email) => Promise<User>
  findByID: (id: ID) => Promise<User>
  validateEmailByID: (id: ID) => Promise<User>
  create: (user: User) => Promise<User>
  verify: (email: Email, password: PlainPassword) => Promise<User>
}
