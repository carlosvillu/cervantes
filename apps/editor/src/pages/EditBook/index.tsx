import {FC} from 'react'
import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from 'react-router-dom'

import {FormCreateOrEditBook} from '../../ui/FormCreateOrEditBook'

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID} = params as {bookID: string}
  const user = await window.domain.CurrentUserUseCase.execute()
  const book = await window.domain.FindByIDBookUseCase.execute({id: bookID})

  return {user, book}
}

export const action = async ({request}: ActionFunctionArgs) => {
  const {id, userID, title, summary, createdAt} = Object.fromEntries(await request.formData()) as {
    id: string
    userID: string
    title: string
    summary: string
    createdAt: string
  }

  const book = await window.domain.UpdateBookUseCase.execute({id, summary, title, userID, createdAt})

  if (book.isEmpty()) return {success: false}

  return redirect(`/book/${book.id as string}`)
}

export const Component: FC<{}> = () => {
  return <FormCreateOrEditBook />
}
