import {Email} from '../Models/Email'
import {ID} from '../Models/ID'
import {PlainPassword} from '../Models/PlainPassword'
import {User} from '../Models/User'
import {Username} from '../Models/Username'

export interface UserRepository {
  create: (id: ID, username: Username, email: Email, password: PlainPassword) => Promise<User>
  current: () => Promise<User>
}
