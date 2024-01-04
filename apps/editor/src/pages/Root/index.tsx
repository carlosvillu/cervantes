import {json, Outlet, redirect, useLoaderData} from 'react-router-dom'

import debug from 'debug'

import type {UserJSONType} from '../../domain/user/Models/User'
import {Layout} from '../../ui'

const log = debug('cervantes:editor:pages:Root')

export const loader = async () => {
  const currentUser = await window.domain.CurrentUserUseCase.execute()
  if (currentUser.isEmpty()) return redirect('/sign-in')

  return json(currentUser.toJSON())
}

export function Component() {
  const user = useLoaderData() as UserJSONType
  log('Logined user => %o', user)

  return (
    <Layout user={user}>
      <Outlet />
    </Layout>
  )
}
