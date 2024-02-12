import {Request} from 'express'
import {z} from 'zod'

const bodyChapter = z.object({
  id: z.string({required_error: 'ID is required'}),
  bookID: z.string({required_error: 'bookID is required'}),
  title: z.string({required_error: 'Title required'}),
  summary: z.string({required_error: 'Summary required'}),
  isRoot: z.boolean({required_error: 'isRoot required'})
})

export const createBodySchema = z.object({
  body: bodyChapter
})

export const updateBodySchema = z.object({
  params: z.object({
    chapterID: z.string({required_error: 'bookID is required'})
  }),
  body: bodyChapter.extend({
    createdAt: z
      .string({required_error: 'createdAt is required'})
      .or(z.number({required_error: 'createdAt is required'}))
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

export const findRootBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  })
})

export interface RequestCreate extends Request {
  body: z.infer<typeof createBodySchema>['body']
}

export interface RequestUpdate extends Request {
  params: z.infer<typeof updateBodySchema>['params']
  body: z.infer<typeof updateBodySchema>['body']
}

export interface RequestFindByID extends Request {
  params: z.infer<typeof findByIDBodySchema>['params']
  query: z.infer<typeof findByIDBodySchema>['query']
}

export interface RequestFindAll extends Request {
  query: z.infer<typeof findAllBodySchema>['query']
}

export interface RequestFindRoot extends Request {
  query: z.infer<typeof findRootBodySchema>['query']
}
