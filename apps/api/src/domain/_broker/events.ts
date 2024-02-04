import {ID} from '../_kernel/ID.js'

export type Event = {type: 'delete_chapter'; payload: {id: ID; userID: ID}} // eslint-disable-line
// {type: 'delete_link'; payload: {id: ID; userID: ID}} | // eslint-disable-line
// {type: 'delete_body'; payload: {id: ID; userID: ID}} // eslint-disable-line
