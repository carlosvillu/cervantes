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
        <Route path="new-book" lazy={async () => import('./pages/NewBook')} />
        <Route path="book/:bookID" lazy={async () => import('./pages/RootBook')}>
          <Route index lazy={async () => import('./pages/IndexBook')} />
          <Route path="map" lazy={async () => import('./pages/MapBook')} />
        </Route>
        <Route path="book/:bookID/chapter/:chapterID" lazy={async () => import('./pages/RootChapter')}>
          <Route index lazy={async () => import('./pages/IndexChapter')} />
          <Route path="editor" lazy={async () => import('./pages/EditorChapter')} />
          <Route path="map" lazy={async () => import('./pages/MapChapter')} />
        </Route>
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
