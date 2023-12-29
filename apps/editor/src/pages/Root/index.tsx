import {json, Outlet, useLoaderData} from 'react-router-dom'

import debug from 'debug'

import {Layout} from '../../ui'

const log = debug('cervantes:editor:pages:Root')

export function loader() {
  return json({hola: 'name'})
}

export function Component() {
  const data = useLoaderData()
  log('%j', data)
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
