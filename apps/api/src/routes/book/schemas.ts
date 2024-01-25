import {Request} from 'express'
import {z} from 'zod'

const bodyBook = z.object({
  id: z.string({required_error: 'ID is required'}),
  title: z.string({required_error: 'Title required'}),
  summary: z.string({required_error: 'Summary required'})
})

export const createBodySchema = z.object({
  body: bodyBook
})

export const updateBodySchema = z.object({
  params: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  }),
  body: bodyBook.extend({
    createdAt: z.number({required_error: 'createdAt is required'})
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

export interface RequestUpdate extends Request {
  params: z.infer<typeof updateBodySchema>['params']
  body: z.infer<typeof updateBodySchema>['body']
}
