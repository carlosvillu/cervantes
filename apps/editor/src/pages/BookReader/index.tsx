import {FC} from 'react'
import {LoaderFunctionArgs, redirect, useLoaderData, useNavigate} from 'react-router-dom'

import {DomainError} from '../../domain/_kernel/DomainError'
import {ErrorCodes} from '../../domain/_kernel/ErrorCodes'
import type {BodyJSON} from '../../domain/body/Models/Body'
import type {BookJSON} from '../../domain/book/Models/Book'
import type {ChapterJSON} from '../../domain/chapter/Models/Chapter'
import type {LinkJSON} from '../../domain/link/Models/Link'
import {BookPreview} from '../../ui/BookPreview'

interface LinkClickParams {
  bookID: String
  chapterID: String
}

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID, chapterID} = params as {bookID: string; chapterID: string}
  const user = await window.domain.CurrentUserUseCase.execute()

  if (user instanceof DomainError && user.errors.find(error => error.message === ErrorCodes.USER_LOGIN_NOT_VERIFIED))
    return redirect('/no-verified-user')

  if (user instanceof DomainError) throw user

  const [book, chapter, links, bodyCommit] = await Promise.all([
    window.domain.FindByIDBookUseCase.execute({id: bookID}),
    window.domain.FindByIDChapterUseCase.execute({id: chapterID, bookID}),
    window.domain.GetAllLinkUseCase.execute({from: chapterID}),
    window.domain.GetLastCommitBodyUseCase.execute({userID: user.id!, bookID, chapterID})
  ])

  return {
    book: book.toJSON(),
    chapter: chapter.toJSON(),
    links: links.toJSON().links,
    body: bodyCommit.toJSON()
  }
}

export const Component: FC<{}> = () => {
  const navigate = useNavigate()

  const {body, book, chapter, links} = useLoaderData() as {
    body: BodyJSON
    book: BookJSON
    chapter: ChapterJSON
    links: LinkJSON[]
  }

  const onLinkClick = ({bookID, chapterID}: LinkClickParams) => {
    const url = `/reader/${String(bookID)}/${String(chapterID)}`
    navigate(url)
  }

  const isPublished = book.published ?? false

  if (!isPublished) {
    return (
      <main className="h-full fixed w-full">
        <h1>This book is not published</h1>
      </main>
    )
  }

  return (
    <main className="h-full fixed w-full bg-gray-900">
      <BookPreview book={book} chapter={chapter} body={body} links={links} onLinkClick={onLinkClick} />
    </main>
  )
}
