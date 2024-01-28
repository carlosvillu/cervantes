import {FC} from 'react'
import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from 'react-router-dom'

import {FormCreateOrEditChapter} from '../../ui/FormCreateOrEditChapter'

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID, chapterID} = params as {bookID: string; chapterID: string}
  const [user, book, chapter] = await Promise.all([
    window.domain.CurrentUserUseCase.execute(),
    window.domain.FindByIDBookUseCase.execute({id: bookID}),
    window.domain.FindByIDChapterUseCase.execute({id: chapterID, bookID})
  ])

  return {user: user.toJSON(), book: book.toJSON(), chapter: chapter.toJSON()}
}

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData()
  const {id, userID, bookID, createdAt, title, summary} = Object.fromEntries(formData) as {
    id: string
    userID: string
    bookID: string
    createdAt: string
    title: string
    summary: string
  }

  const chapter = await window.domain.UpdateChapterUseCase.execute({bookID, createdAt, id, summary, title, userID})

  if (chapter.isEmpty()) return {success: false}

  return redirect(`/book/${bookID}/chapter/${id}`)
}

export const Component: FC<{}> = () => {
  return <FormCreateOrEditChapter />
}
