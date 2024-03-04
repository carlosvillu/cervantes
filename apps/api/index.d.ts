import type {Domain} from './src/domain/index.js'
import {User} from './src/domain/user/Models/User.ts'

export {}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      [key: string]: string | undefined
      STAGE: 'development' | 'production'
      PORT: string
      HOST: string
      ACCESS_TOKEN_PRIVATE_KEY: string
      REFRESH_TOKEN_PRIVATE_KEY: string
      REDIS_PORT: string
      REDIS_HOST: string
      REDIS_PROTOCOL: string
      REDIS_PASSWORD: string
      REDIS_USER: string
      SALT: string
      RESEND_API_KEY: string
    }
  }
}

declare global {
  namespace Express {
    export interface Request {
      id: string | undefined
      user: User
      _domain: Domain
    }
  }
}
