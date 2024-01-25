import {FC} from 'react'
import {ActionFunctionArgs, redirect, useActionData} from 'react-router-dom'

import {FormCreateOrEditBook} from '../../ui/FormCreateOrEditBook'
import {Notification} from '../../ui/Notification'

export const loader = async () => {
  const user = await window.domain.CurrentUserUseCase.execute()
  return {user}
}

export const action = async ({request}: ActionFunctionArgs) => {
  const {id, userID, title, summary} = Object.fromEntries(await request.formData()) as {
    id: string
    userID: string
    title: string
    summary: string
  }

  const book = await window.domain.CreateBookUseCase.execute({id, summary, title, userID})

  if (book.isEmpty()) return {success: false}

  return redirect(`/book/${book.id as string}`)
}

export const Component: FC<{}> = () => {
  return (
    <>
      <FormCreateOrEditBook />
    </>
  )
}
