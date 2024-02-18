import {z} from 'zod'

import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {Token} from './Token.js'

const ValidationTokenValidation = z.object({
  id: z.instanceof(ID, {message: 'ID required'}),
  userID: z.instanceof(ID, {message: 'userID required'}),
  token: z.instanceof(Token, {message: 'Token is required'}),
  createdAt: z.instanceof(TimeStamp).optional()
})

export class ValidationToken {
  static create({id, userID, token, createdAt}: z.infer<typeof ValidationTokenValidation>) {
    ValidationTokenValidation.parse({id, userID, token, createdAt})

    return new ValidationToken(id, userID, token, createdAt ?? TimeStamp.now(), false)
  }

  static empty() {
    return new ValidationToken(undefined, undefined, undefined, undefined, true)
  }

  constructor(
    private readonly _id?: ID,
    private readonly _userID?: ID,
    private readonly _token?: Token,
    private readonly _createdAt?: TimeStamp,
    public readonly empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line
  get userID() {return this._userID?.value} // eslint-disable-line
  get token() {return this._token?.value} // eslint-disable-line
  get createdAt() {return this._createdAt?.value} // eslint-disable-line

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  attributes() {
    return {
      userID: this.userID,
      token: this.token,
      createdAt: this.createdAt
    }
  }

  toJSON() {
    return {
      id: this.id,
      ...this.attributes()
    }
  }
}
