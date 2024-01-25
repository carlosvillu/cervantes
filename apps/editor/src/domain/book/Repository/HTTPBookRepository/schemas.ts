import {z} from 'zod'

/** Create */
export const CreateResponseSchema = z.object({
  id: z.string({required_error: 'ID required'}),
  userID: z.string({required_error: 'userID required'}),
  summary: z.string({required_error: 'Summary required'}),
  title: z.string({required_error: 'Title required'})
})
export type CreateResponseType = z.infer<typeof CreateResponseSchema>

/** Update One by ID */
export const UpdateResponseSchema = CreateResponseSchema.extend({
  createdAt: z.number({required_error: 'createdAt is required'}),
  updatedAt: z.number({required_error: 'updatedAt is required'})
})
export type UpdateResponseType = z.infer<typeof UpdateResponseSchema>

/** Find All */
export const FindAllResponseSchema = CreateResponseSchema.extend({
  createdAt: z.number({required_error: 'createdAt is required'}),
  updatedAt: z.number({required_error: 'updatedAt is required'})
}).array()
export type FindAllResponseType = z.infer<typeof FindAllResponseSchema>

/** Find One by ID */
export const FindByIDResponseSchema = CreateResponseSchema.extend({
  createdAt: z.number({required_error: 'createdAt is required'}),
  updatedAt: z.number({required_error: 'updatedAt is required'})
})
export type FindByIDResponseType = z.infer<typeof FindByIDResponseSchema>
