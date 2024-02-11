import {FC} from 'react'
import {ActionFunctionArgs, json, LoaderFunctionArgs} from 'react-router-dom'

import {BodyJSON} from '../../domain/body/Models/Body.ts'
import {Editor} from '../../ui/Editor/index.tsx'

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID, chapterID} = params as {bookID: string; chapterID: string}
  const currentUser = await window.domain.CurrentUserUseCase.execute()
  const [bodyCommit, bodyRemote, chapter] = await Promise.all([
    window.domain.GetLastCommitBodyUseCase.execute({userID: currentUser.id!, bookID, chapterID}),
    window.domain.GetLastBodyUseCase.execute({userID: currentUser.id!, bookID, chapterID}),
    window.domain.FindByIDChapterUseCase.execute({id: chapterID, bookID})
  ])

  if (bodyRemote.isNewerThan(bodyCommit)) {
    await window.domain.CommitBodyUseCase.execute(bodyRemote.toJSON() as BodyJSON)
  }
  const body = await window.domain.GetLastCommitBodyUseCase.execute({userID: currentUser.id!, bookID, chapterID})

  return json({user: currentUser.toJSON(), lastCommitBody: body.stripContent(), chapter: chapter.toJSON()})
}

export const action = async ({request}: ActionFunctionArgs) => {
  const {id, userID, bookID, chapterID, content} = Object.fromEntries(await request.formData()) as {
    id: string
    userID: string
    bookID: string
    chapterID: string
    content: string
  }

  const body = await window.domain.SaveBodyUseCase.execute({id, userID, bookID, chapterID, content})

  return json(body.toJSON())
}

export const Component: FC<{}> = () => {
  return <Editor />
}
