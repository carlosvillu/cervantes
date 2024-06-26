import {ID} from '../_kernel/ID.js'
import {ValidationStatus} from '../auth/Models/ValidationStatus.js'

export type Event =
  {type: 'delete_chapter'; payload: {id: ID; userID: ID; bookID: ID}} | // eslint-disable-line
  {type: 'check_validation_token'; payload: {id: ID; userID: ID; status: ValidationStatus}} // eslint-disable-line
