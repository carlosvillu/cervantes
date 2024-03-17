import {z} from 'zod'

const BookCoverBodySchema = z.object({
  id: z.string({required_error: 'id required'}),
  bookID: z.string({required_error: 'id required'}),
  key: z.string({required_error: 'key required'}),
  createdAt: z.number({required_error: 'id required'}),
  updatedAt: z.number({required_error: 'id required'})
})

const ChapterCoverBodySchema = BookCoverBodySchema.extend({
  chapterID: z.string({required_error: 'chapterID required'})
})

/** BookCover */
export const CreateBookCoverResponseSchema = BookCoverBodySchema
export type CreateBookCoverResponseType = z.infer<typeof CreateBookCoverResponseSchema>

export const FindBookCoverByBookIDResponseSchema = BookCoverBodySchema
export type FindBookCoverByBookIDResponseType = z.infer<typeof FindBookCoverByBookIDResponseSchema>

export const RemoveBookCoverByBookIDResponseSchema = z.object({})
export type RemoveBookCoverByBookIDResponseType = z.infer<typeof RemoveBookCoverByBookIDResponseSchema>

/** ChapterCover */
export const CreateChapterCoverResponseSchema = ChapterCoverBodySchema
export type CreateChapterCoverResponseType = z.infer<typeof CreateChapterCoverResponseSchema>

export const FindChapterCoverByChapterIDResponseSchema = ChapterCoverBodySchema
export type FindChapterCoverByChapterIDResponseType = z.infer<typeof FindChapterCoverByChapterIDResponseSchema>

export const RemoveChapterCoverByChapterIDResponseSchema = z.object({})
export type RemoveChapterCoverByChapterIDResponseType = z.infer<typeof RemoveChapterCoverByChapterIDResponseSchema>

/** Generate Image */
export const GenerateImageResponseSchema = z.object({images: z.string({required_error: 'ImageURL required'}).array()})
export type GenerateImageResponseType = z.infer<typeof GenerateImageResponseSchema>
