import {FC} from 'react'
import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from 'react-router-dom'

import {FormCreateOrEditBook} from '../../ui/FormCreateOrEditBook'

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID} = params as {bookID: string}

  const [book, user, chapters] = await Promise.all([
    window.domain.FindByIDBookUseCase.execute({id: bookID}),
    window.domain.CurrentUserUseCase.execute(),
    window.domain.GetAllChapterUseCase.execute({bookID})
  ])

  return {user, book, chapters}
}

export const action = async ({request}: ActionFunctionArgs) => {
  const {id, userID, title, published, summary, rootChapterID, createdAt} = Object.fromEntries(
    await request.formData()
  ) as {
    id: string
    userID: string
    title: string
    summary: string
    createdAt: string
    rootChapterID: string
    published: string
  }

  const book = await window.domain.UpdateBookUseCase.execute({
    id,
    summary,
    published: published === 'on',
    title,
    userID,
    rootChapterID,
    createdAt
  })

  if (book.isEmpty()) return {success: false}

  return redirect(`/book/${book.id as string}`)
}

export const Component: FC<{}> = () => {
  return <FormCreateOrEditBook />
}
