import {Outlet} from 'react-router-dom'

import {Layout} from '@cervantes/ui'

export function Component() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
