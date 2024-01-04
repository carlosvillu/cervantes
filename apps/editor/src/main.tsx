import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'

import debug from 'debug'

import {Component as ErrorPage} from './pages/Error'
import {EditorContext} from './context'

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
      <Route path="/sign-up" lazy={async () => import('./pages/SignUp')} />
      <Route path="/sign-out" lazy={async () => import('./pages/SignOut')} />
      <Route path="/" lazy={async () => import('./pages/Root')} errorElement={<ErrorPage />}>
        <Route index lazy={async () => import('./pages/Index')} />
      </Route>
    </>
  )
)

// eslint-disable-next-line
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EditorContext>
      <RouterProvider router={router} />
    </EditorContext>
  </React.StrictMode>
)
