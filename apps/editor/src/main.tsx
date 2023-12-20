import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import {Component as ErrorPage} from './pages/Error'

import './index.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/sign-in" lazy={async () => import('./pages/SignIn')} />
      <Route
        path="/"
        lazy={async () => import('./pages/Root')}
        errorElement={<ErrorPage />}
      >
        <Route index lazy={async () => import('./pages/Index')} />
      </Route>
    </>
  )
)

// eslint-disable-next-line
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
