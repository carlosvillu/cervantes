import {ID} from '../_kernel/ID.js'

export type Event = {type: 'delete_chapter'; payload: {id: ID; userID: ID; bookID: ID}} // eslint-disable-line
// {type: 'delete_body'; payload: {id: ID; userID: ID}} // eslint-disable-line
