import {Request} from 'express'
import {z} from 'zod'

export const getBookCoverImageByBookIDBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  })
})

export const getChapterCoverImageByChapterIDBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'}),
    chapterID: z.string({required_error: 'chapterID is required'})
  })
})

export const removeBookCoverImageByBookIDBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'})
  })
})

export const removeChapterCoverImageByChapterIDBodySchema = z.object({
  query: z.object({
    bookID: z.string({required_error: 'bookID is required'}),
    chapterID: z.string({required_error: 'chapterID is required'})
  })
})

export const setBookCoverImageBodySchema = z.object({
  body: z.object({
    id: z.string({required_error: 'id is required'}),
    bookID: z.string({required_error: 'bookID is required'}),
    key: z.string({required_error: 'key is required'})
  })
})

export const setChapterCoverImageBodySchema = z.object({
  body: z.object({
    id: z.string({required_error: 'id is required'}),
    bookID: z.string({required_error: 'bookID is required'}),
    chapterID: z.string({required_error: 'chapterID is required'}),
    key: z.string({required_error: 'key is required'})
  })
})

export interface RequestGetBookCoverImageByBookID extends Request {
  query: z.infer<typeof getBookCoverImageByBookIDBodySchema>['query']
}

export interface RequestGetChapterCoverImageByChapterID extends Request {
  query: z.infer<typeof getChapterCoverImageByChapterIDBodySchema>['query']
}

export interface RequestRemoveBookCoverImageByBookID extends Request {
  query: z.infer<typeof getBookCoverImageByBookIDBodySchema>['query']
}

export interface RequestRemoveChapterCoverImageByChapterID extends Request {
  query: z.infer<typeof getChapterCoverImageByChapterIDBodySchema>['query']
}

export interface RequestSetBookCoverImage extends Request {
  body: z.infer<typeof setBookCoverImageBodySchema>['body']
}

export interface RequestSetChapterCoverImage extends Request {
  body: z.infer<typeof setChapterCoverImageBodySchema>['body']
}
