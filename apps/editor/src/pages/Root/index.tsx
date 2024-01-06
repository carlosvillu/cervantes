import {json, Outlet, redirect, useLoaderData} from 'react-router-dom'

import debug from 'debug'

import type {Books} from '../../domain/book/Models/Books'
import type {User} from '../../domain/user/Models/User'
import {Layout} from '../../ui'

const log = debug('cervantes:editor:pages:Root')

export const loader = async () => {
  const currentUser = await window.domain.CurrentUserUseCase.execute()
  const books = await window.domain.GetAllBookUseCase.execute()

  log('Logined user => %o', currentUser)

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
