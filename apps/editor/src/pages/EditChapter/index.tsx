import {FC} from 'react'
import {ActionFunctionArgs, LoaderFunctionArgs, redirect, useLoaderData} from 'react-router-dom'

import {BookJSON} from '../../domain/book/Models/Book'
import {ChapterJSON} from '../../domain/chapter/Models/Chapter'
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
  const {intent} = Object.fromEntries(formData) as {intent: 'edit-chapter' | 'remove-chapter'}

  if (intent === 'remove-chapter') {
    const {chapterID, bookID} = Object.fromEntries(formData) as {
      chapterID: string
      bookID: string
    }

    await window.domain.RemoveByIDChapterUseCase.execute({id: chapterID, bookID})

    return redirect(`/book/${bookID}`)
  }

  if (intent === 'edit-chapter') {
    const {id, userID, bookID, createdAt, title, summary} = Object.fromEntries(formData) as {
      id: string
      userID: string
      bookID: string
      createdAt: string
      title: string
      summary: string
    }

    const chapter = await window.domain.UpdateChapterUseCase.execute({
      bookID,
      createdAt,
      id,
      summary,
      title,
      userID
    })

    if (chapter.isEmpty()) return {success: false}

    return redirect(`/book/${bookID}/chapter/${id}`)
  }
}

export const Component: FC<{}> = () => {
  const {book, chapter} = useLoaderData() as {book: BookJSON; chapter: ChapterJSON}
  return <FormCreateOrEditChapter action={`/book/${book.id as string}/chapter/${chapter.id as string}/edit`} />
}
