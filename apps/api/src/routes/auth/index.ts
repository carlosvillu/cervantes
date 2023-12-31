/* eslint @typescript-eslint/no-misused-promises:0, @typescript-eslint/no-non-null-assertion:0 */

import debug from 'debug'
import {Response, Router} from 'express'

import {validate} from '../../middlewares/validate.js'
import {
  loginBodySchema,
  refreshTokenBodySchema,
  RequestLogin,
  RequestRefresh,
  RequestSignup,
  signupBodySchema
} from './schemas.js'

const log = debug('cervantes:api:routes:auth')

export const router = Router()
router.post('/signup', validate(signupBodySchema), async (req: RequestSignup, res: Response) => {
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

router.post('/login', validate(loginBodySchema), async (req: RequestLogin, res: Response) => {
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

router.post('/refresh', validate(refreshTokenBodySchema), async (req: RequestRefresh, res: Response) => {
  log(`Verifying Refresh Token ${req.body.refresh}`)
  const authTokens = await req._domain.VerifyRefreshTokenAuthUseCase.execute({refresh: req.body.refresh})

  if (authTokens.isEmpty()) return res.status(400).json({error: true, message: 'Invalid Refresh Token'})

  log(`New Access y Refresh tokens created`)
  res.status(200).json(authTokens.toJSON())
})

router.delete('/refresh', validate(refreshTokenBodySchema), async (req: RequestRefresh, res: Response) => {
  log(`Removing Refresh Token ${req.body.refresh}`)
  const authTokens = await req._domain.RemoveUserTokenAuthUseCase.execute({refresh: req.body.refresh})

  if (!authTokens.isEmpty()) return res.status(400).json({error: true, message: 'Invalid Refresh Token'})

  res.status(200).json({error: false, message: 'Logged Out Sucessfully'})
})
