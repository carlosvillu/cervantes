import {FC} from 'react'
import {LoaderFunctionArgs, useLoaderData, useNavigate} from 'react-router-dom'

import type {BodyJSON} from '../../domain/body/Models/Body'
import type {BookJSON} from '../../domain/book/Models/Book'
import type {ChapterJSON} from '../../domain/chapter/Models/Chapter'
import type {LinkJSON} from '../../domain/link/Models/Link'
// import type {UserJSON} from '../../domain/user/Models/User'
import {BookPreview} from '../../ui/BookPreview'
import {IphoneMockup} from '../../ui/IphoneMockup'

interface LinkClickParams {
  bookID: String
  chapterID: String
}

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID, chapterID} = params as {bookID: string; chapterID: string}
  const user = await window.domain.CurrentUserUseCase.execute()

  const [book, chapter, links, bodyCommit] = await Promise.all([
    window.domain.FindByIDBookUseCase.execute({id: bookID}),
    window.domain.FindByIDChapterUseCase.execute({id: chapterID, bookID}),
    window.domain.GetAllLinkUseCase.execute({from: chapterID}),
    window.domain.GetLastCommitBodyUseCase.execute({userID: user.id!, bookID, chapterID})
  ])

  return {
    book: book.toJSON(),
    user: user.toJSON(),
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
    const url = `/book/${String(bookID)}/preview/${String(chapterID)}`
    navigate(url)
  }

  const readerUrl = `/reader/${String(book.id)}/${String(book.rootChapterID)}`

  return (
    <div className="p-4">
      <IphoneMockup>
        <BookPreview book={book} chapter={chapter} body={body} links={links} onLinkClick={onLinkClick} />
      </IphoneMockup>
      <div className="mt-4 flex justify-center ">
        <button
          className="w-36 bg-indigo-600 text-white font-semibold py-2 rounded-md "
          onClick={() => window.open(readerUrl)}
        >
          Share
        </button>
      </div>
    </div>
  )
}
