import {FC} from 'react'
import {ActionFunctionArgs, json, LoaderFunctionArgs} from 'react-router-dom'

import {Editor} from '../../ui/Editor/index.tsx'

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID, chapterID} = params as {bookID: string; chapterID: string}
  const currentUser = await window.domain.CurrentUserUseCase.execute()
  const [bodyCommit, bodyRemote] = await Promise.all([
    window.domain.GetLastCommitBodyUseCase.execute({userID: currentUser.id!, bookID, chapterID}),
    window.domain.GetLastBodyUseCase.execute({userID: currentUser.id!, bookID, chapterID})
  ])

  if (bodyRemote.isNewerThan(bodyCommit)) {
    debugger
  }

  return json({user: currentUser.toJSON(), lastCommitBody: bodyCommit.stripContent()})
}

export const action = async ({request}: ActionFunctionArgs) => {
  const {id, userID, bookID, chapterID, content} = Object.fromEntries(await request.formData()) as {
    id: string
    userID: string
    bookID: string
    chapterID: string
    content: string
  }
  return json({})
}

export const Component: FC<{}> = () => {
  return <Editor />
}
