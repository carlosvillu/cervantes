import {Request} from 'express'
import {z} from 'zod'

export const createBodySchema = z.object({
  body: z.object({
    id: z.string({required_error: 'ID is required'}),
    bookID: z.string({required_error: 'bookID is required'}),
    userID: z.string({required_error: 'userID is required'}),
    chapterID: z.string({required_error: 'chapterID is required'}),
    content: z.string({required_error: 'content is required'})
  })
})

export const findByIDBodySchema = z.object({
  params: z.object({
    bodyID: z.string({required_error: 'bodyID is required'})
  })
})

export const findAllBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'}),
    chapterID: z.string({required_error: 'chapterID is required'})
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
