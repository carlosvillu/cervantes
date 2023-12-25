import bcrypt from 'bcrypt'
import debug from 'debug'
import {Router} from 'express'
import jwt from 'jsonwebtoken'

const log = debug('cervantes:api:router:api:user')

const router = Router()
const {SALT, ACCESS_TOKEN_PRIVATE_KEY} = process.env

router.get('/', auth, async (req, res) => {})
