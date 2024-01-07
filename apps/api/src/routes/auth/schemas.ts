import {Request} from 'express'
import {z} from 'zod'

export const signupBodySchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'ID is required'
    }),
    username: z.string({
      required_error: 'Full name is required'
    }),
    password: z.string({
      required_error: 'Password is required'
    }),
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Not a valid email')
  })
})

export const loginBodySchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Full name is required'
    }),
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Not a valid email')
  })
})

export const refreshTokenBodySchema = z.object({
  body: z.object({
    refresh: z.string({
      required_error: 'Refrash token is required'
    })
  })
})

export interface RequestSignup extends Request {
  body: z.infer<typeof signupBodySchema>['body']
}

export interface RequestLogin extends Request {
  body: z.infer<typeof loginBodySchema>['body']
}

export interface RequestRefresh extends Request {
  body: z.infer<typeof refreshTokenBodySchema>['body']
}
