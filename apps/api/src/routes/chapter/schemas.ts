import {Request} from 'express'
import {z} from 'zod'

export const createBodySchema = z.object({
  body: z.object({
    id: z.string({required_error: 'ID is required'}),
    bookID: z.string({required_error: 'bookID is required'}),
    title: z.string({required_error: 'Title required'}),
    summary: z.string({required_error: 'Summary required'})
  })
})

export const findByIDBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  }),
  params: z.object({
    chapterID: z.string({required_error: 'chapterID is required'})
  })
})

export const findAllBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  })
})

export interface RequestCreate extends Request {
  body: z.infer<typeof createBodySchema>['body']
}

export interface RequestFindByID extends Request {
  params: z.infer<typeof findByIDBodySchema>['params']
  query: z.infer<typeof findByIDBodySchema>['query']
}

export interface RequestFindAll extends Request {
  query: z.infer<typeof findAllBodySchema>['query']
}
