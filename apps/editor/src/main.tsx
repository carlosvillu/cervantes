import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'

import debug from 'debug'

import {Component as ErrorPage} from './pages/Error'

import './index.css'

const log = debug('cervantes:editor:entrypoint')

log(`
================================================
🌏 Stage: ${import.meta.env.VITE_STAGE ?? 'UNKOWN'}
🌏 ENV: ${import.meta.env.VITE_NODE_ENV ?? 'UNKOWN'}
================================================
`)

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/sign-in" lazy={async () => import('./pages/SignIn')} />
      <Route path="/" lazy={async () => import('./pages/Root')} errorElement={<ErrorPage />}>
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
