import {Request} from 'express'
import {z} from 'zod'

export const createBodySchema = z.object({
  body: z.object({
    id: z.string({required_error: 'ID is required'}),
    from: z.string({required_error: 'from is required'}),
    to: z.string({required_error: 'to is required'}),
    kind: z.string({required_error: 'kind is required'}),
    body: z.string({required_error: 'body is required'}),
    bookID: z.string({required_error: 'bookID is required'})
  })
})

export const findByIDBodySchema = z.object({
  params: z.object({
    linkID: z.string({required_error: 'linkID is required'})
  })
})

export const findAllBodySchema = z.object({
  query: z.object({
    from: z.string({required_error: 'from is required'})
  })
})

export interface RequestCreate extends Request {
  body: z.infer<typeof createBodySchema>['body']
}

export interface RequestFindByID extends Request {
  params: z.infer<typeof findByIDBodySchema>['params']
}

export interface RequestFindAll extends Request {
  query: z.infer<typeof findAllBodySchema>['query']
}
