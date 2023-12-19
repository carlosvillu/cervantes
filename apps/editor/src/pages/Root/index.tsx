import {json, Outlet, useLoaderData} from 'react-router-dom'

import {Layout} from '@cervantes/ui'

export function loader() {
  return json({hola: 'name'})
}

export function Component() {
  const data = useLoaderData()
  console.log(data)
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
