/* eslint @typescript-eslint/no-misused-promises:0, @typescript-eslint/no-non-null-assertion:0 */

import debug from 'debug'
import {NextFunction, Request, Response, Router} from 'express'
import {z} from 'zod'

import {validate} from '../../middlewares/validate.js'
import {loginBodySchema, signupBodySchema} from './schemas.js'

const log = debug('cervantes:api:routes:auth')

interface RequestSignup extends Request {
  body: z.infer<typeof signupBodySchema>['body']
}

interface RequestLogin extends Request {
  body: z.infer<typeof loginBodySchema>['body']
}

export const router = Router()
router.post('/signup', validate(signupBodySchema), async (req: RequestSignup, res: Response, next: NextFunction) => {
  log(`Creating user for email ${req.body.email}`)

  const user = await req._domain.FindOneUserUseCase.execute({email: req.body.email})

  if (!user.isEmpty()) {
    log(`User with email ${req.body.email} already exist`)
    return res.status(400).json({error: true, message: 'User with given email already exist'})
  }

  await req._domain.CreateUserUseCase.execute(req.body)
  log(`User with email ${req.body.email} created`)
  res.status(201).json({error: false, message: 'Account created sucessfully'})
})

router.post('/login', validate(loginBodySchema), async (req: RequestLogin, res: Response, next: NextFunction) => {
  log(`Login User with email ${req.body.email}`)

  const user = await req._domain.FindOneUserUseCase.execute({email: req.body.email})
  if (user.isEmpty()) {
    log(`User with email ${req.body.email} NOT exist`)
    return res.status(401).json({error: true, message: 'Invalid email or password'})
  }

  const verfiedUser = await req._domain.VerifyEmailAndPasswordUserUseCase.execute({
    email: req.body.email,
    password: req.body.password
  })

  if (verfiedUser.isEmpty()) {
    log(`User with Password **** are differents`)
    return res.status(401).json({error: true, message: 'Invalid email or password'})
  }

  const tokens = await req._domain.CreateTokenAuthUseCase.execute({id: user.id!})
  log(`User with email ${req.body.email} Successfully Logined`)
  res.status(200).json(tokens.toJSON())
})
