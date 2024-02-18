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

export const checkValidationTokenSchema = z.object({
  query: z.object({
    code: z.string({required_error: 'code is required'})
  }),
  params: z.object({
    id: z.string({required_error: 'id is required'})
  })
})

export const findByIDValidationTokenSchema = z.object({
  params: z.object({
    id: z.string({required_error: 'id is required'})
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

export interface RequestCheckValidationToken extends Request {
  query: z.infer<typeof checkValidationTokenSchema>['query']
  params: z.infer<typeof checkValidationTokenSchema>['params']
}

export interface RequestFindByIDValidationToken extends Request {
  params: z.infer<typeof checkValidationTokenSchema>['params']
}
