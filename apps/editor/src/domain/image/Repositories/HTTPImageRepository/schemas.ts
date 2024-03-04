import {z} from 'zod'

const BookCoverBodySchema = z.object({
  id: z.string({required_error: 'id required'}),
  bookID: z.string({required_error: 'id required'}),
  key: z.string({required_error: 'key required'}),
  createdAt: z.number({required_error: 'id required'}),
  updatedAt: z.number({required_error: 'id required'})
})

export const CreateBookCoverResponseSchema = BookCoverBodySchema
export type CreateBookCoverResponseType = z.infer<typeof CreateBookCoverResponseSchema>

export const FindBookCoverByBookIDResponseSchema = BookCoverBodySchema
export type FindBookCoverByBookIDResponseType = z.infer<typeof FindBookCoverByBookIDResponseSchema>

export const RemoveBookCoverByBookIDResponseSchema = z.object({})
export type RemoveBookCoverByBookIDResponseType = z.infer<typeof RemoveBookCoverByBookIDResponseSchema>
