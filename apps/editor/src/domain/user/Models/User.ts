import {z} from 'zod'

import {ID} from '../../_kernel/ID'
import {Email} from './Email'
import {PlainPassword} from './PlainPassword'
import {Username} from './Username'
import {VerifiedStatus} from './VerifiedStatus'

const UserValidations = z.object({
  id: z.instanceof(ID, {message: 'ID is required'}),
  email: z.instanceof(Email, {message: 'Email is required'}),
  username: z.instanceof(Username, {message: 'Username is required'}),
  password: z.instanceof(PlainPassword, {message: 'Password is required'}),
  verified: z.instanceof(VerifiedStatus, {message: 'VerifiedStatus is required'}).optional()
})
export interface UserJSON {
  id: string
  email: string
  username: string
  password: string
  verified: boolean
}

export class User {
  static create({email, username, password, id, verified}: z.infer<typeof UserValidations>) {
    UserValidations.parse({email, username, password, id, verified})
    return new User(id, username, email, password, verified ?? VerifiedStatus.create({value: false}), false)
  }

  static empty() {
    return new User(undefined, undefined, undefined, undefined, undefined, true)
  }

  constructor(
    private readonly _id?: ID,
    private readonly _username?: Username,
    private readonly _email?: Email,
    private readonly _password?: PlainPassword,
    private readonly _verified?: VerifiedStatus,
    private readonly _empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line 
  get username() {return this._username?.value} // eslint-disable-line 
  get email() {return this._email?.value} // eslint-disable-line 
  get password() {return this._password?.value} // eslint-disable-line 
  get verified() {return this._verified?.value} // eslint-disable-line 


  isEmpty(): boolean {return this._empty !== undefined && this._empty} // eslint-disable-line 

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      verified: this.verified
    }
  }
}
