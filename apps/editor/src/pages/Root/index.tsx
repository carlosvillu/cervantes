import {json, Outlet, redirect, useLoaderData} from 'react-router-dom'

import debug from 'debug'

import {DomainError} from '../../domain/_kernel/DomainError'
import {ErrorCodes} from '../../domain/_kernel/ErrorCodes'
import type {Books} from '../../domain/book/Models/Books'
import type {User} from '../../domain/user/Models/User'
import {Layout} from '../../ui/Layout'

const log = debug('cervantes:editor:pages:Root')

export const loader = async () => {
  const currentUser = await window.domain.CurrentUserUseCase.execute()
  const books = await window.domain.GetAllBookUseCase.execute()

  log('Logined user => %o', currentUser)

  if (
    currentUser instanceof DomainError &&
    currentUser.errors.find(error => error.message === ErrorCodes.USER_LOGIN_NOT_VERIFIED)
  )
    return redirect('/no-verified-user')

  if (currentUser instanceof DomainError) throw currentUser

  if (currentUser.isEmpty()) return redirect('/sign-in')

  return json({user: currentUser, books})
}

export function Component() {
  const {user, books} = useLoaderData() as {user: User; books: Books}

  return (
    <Layout user={user} books={books}>
      <Outlet />
    </Layout>
  )
}
