import {Request} from 'express'
import {z} from 'zod'

export const getCoverImageByBookIDBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  })
})

export const removeCoverImageByBookIDBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  })
})

export const setCoverImageBodySchema = z.object({
  body: z.object({
    id: z.string({required_error: 'id is required'}),
    bookID: z.string({required_error: 'bookID is required'}),
    key: z.string({required_error: 'key is required'})
  })
})

export interface RequestGetCoverImageByBookID extends Request {
  query: z.infer<typeof getCoverImageByBookIDBodySchema>['query']
}

export interface RequestRemoveCoverImageByBookID extends Request {
  query: z.infer<typeof getCoverImageByBookIDBodySchema>['query']
}

export interface RequestSetCoverImage extends Request {
  body: z.infer<typeof setCoverImageBodySchema>['body']
}
