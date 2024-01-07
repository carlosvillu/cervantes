import {Request} from 'express'
import {z} from 'zod'

export const createBodySchema = z.object({
  body: z.object({
    id: z.string({required_error: 'ID is required'}),
    title: z.string({required_error: 'Title required'}),
    summary: z.string({required_error: 'Summary required'})
  })
})

export const findByIDBodySchema = z.object({
  params: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  })
})

export const findAllBodySchame = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  })
})

export interface RequestFindByID extends Request {
  params: z.infer<typeof findByIDBodySchema>['params']
}

export interface RequestFindAll extends Request {
  query: z.infer<typeof findAllBodySchame>['query']
}

export interface RequestCreate extends Request {
  body: z.infer<typeof createBodySchema>['body']
}
