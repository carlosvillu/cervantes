import {z} from 'zod'

/** Create */
export const CreateResponseSchema = z.object({
  id: z.string({required_error: 'ID required'}),
  userID: z.string({required_error: 'userID required'}),
  summary: z.string({required_error: 'Summary required'}),
  title: z.string({required_error: 'Title required'}),
  rootChapterID: z.string().optional()
})
export type CreateResponseType = z.infer<typeof CreateResponseSchema>

const extendedBody = z.object({
  published: z.boolean({required_error: 'published is required'}),
  createdAt: z.number({required_error: 'createdAt is required'}),
  updatedAt: z.number({required_error: 'updatedAt is required'})
})

/** Update One by ID */
export const UpdateResponseSchema = CreateResponseSchema.merge(extendedBody)
export type UpdateResponseType = z.infer<typeof UpdateResponseSchema>

/** Find All */
export const FindAllResponseSchema = CreateResponseSchema.merge(extendedBody).array()
export type FindAllResponseType = z.infer<typeof FindAllResponseSchema>

/** Find One by ID */
export const FindByIDResponseSchema = CreateResponseSchema.merge(extendedBody)
export type FindByIDResponseType = z.infer<typeof FindByIDResponseSchema>
