/* eslint @typescript-eslint/no-misused-promises:0, @typescript-eslint/no-non-null-assertion:0 */

import debug from 'debug'
import {Request, Response, Router} from 'express'

import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validate.js'
import {
  checkValidationTokenSchema,
  findByIDValidationTokenSchema,
  loginBodySchema,
  refreshTokenBodySchema,
  RequestCheckValidationToken,
  RequestFindByIDValidationToken,
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

router.post('/validationToken', auth({allowUnvalidate: true}), async (req: Request, res: Response) => {
  log('Sending a validation token for the user %s', req.user.email)

  const validationToken = await req._domain.SendValidationCodeAuthUseCase.execute({
    id: req.user.id!,
    email: req.user.email!
  })

  res.status(200).json(validationToken.toJSON())
})

router.post(
  '/validationToken/:id',
  validate(checkValidationTokenSchema),
  auth({allowUnvalidate: true}),
  async (req: RequestCheckValidationToken, res: Response) => {
    log('Checking a validation token for the user %s with the code', req.user.email, req.query.code)

    const status = await req._domain.CheckValidationTokenAuthUseCase.execute({
      id: req.params.id,
      userID: req.user.id!,
      token: req.query.code
    })

    if (!status.isSuccess()) return res.status(400).json({error: true, message: 'Invalid code'})

    res.status(200).json(status.toJSON())
  }
)

router.get(
  '/validationToken/:id',
  validate(findByIDValidationTokenSchema),
  auth({allowUnvalidate: true}),
  async (req: RequestFindByIDValidationToken, res: Response) => {
    log('Find by ID validation token for the user %s with the id', req.user.email, req.params.id)

    const validationToken = await req._domain.FindByIDValidationTokenAuthUseCase.execute({
      id: req.params.id,
      userID: req.user.id!
    })

    if (validationToken.isEmpty()) return res.status(400).json({error: true, message: 'Invalid validation token'})

    res.status(200).json(validationToken.cleanUpSensitive().toJSON())
  }
)
