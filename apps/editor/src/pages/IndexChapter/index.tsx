import {FC, useEffect, useState} from 'react'
import {ActionFunctionArgs, Link, LoaderFunctionArgs, useActionData, useLoaderData} from 'react-router-dom'

import {BookJSON} from '../../domain/book/Models/Book'
import {ChapterJSON} from '../../domain/chapter/Models/Chapter'
import {LinkJSON} from '../../domain/link/Models/Link'
import {fromTimeStampToDate} from '../../js/date'
import {capitalizaFirstLetter} from '../../js/string'
import {FormNewLink} from '../../ui/FormNewLink'
import {Notification} from '../../ui/Notification'
import {OverlayWide} from '../../ui/OverlayWide'
import {TableFullWidth} from '../../ui/TableFullWidth'

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID, chapterID} = params as {bookID: string; chapterID: string}

  const [book, user, chapter, links, chapters] = await Promise.all([
    window.domain.FindByIDBookUseCase.execute({id: bookID}),
    window.domain.CurrentUserUseCase.execute(),
    window.domain.FindByIDChapterUseCase.execute({id: chapterID, bookID}),
    window.domain.GetAllLinkUseCase.execute({from: chapterID}),
    window.domain.GetAllChapterUseCase.execute({bookID})
  ])

  return {
    book: book.toJSON(),
    user: user.toJSON(),
    chapter: chapter.toJSON(),
    links: links.toJSON().links,
    chapters: chapters.toJSON().chapters
  }
}

export const action = async ({request}: ActionFunctionArgs) => {
  const {id, bookID, userID, chapterID, kind, body, to} = Object.fromEntries(await request.formData()) as {
    intent: string
    id: string
    from: string
    to: string
    body: string
    chapterID: string
    kind: string
    bookID: string
    userID: string
  }

  const link = await window.domain.CreateLinkUseCase.execute({id, from: chapterID, to, body, bookID, userID, kind})

  if (link.isEmpty()) return {success: false}

  return {success: true}
}

export const Component: FC<{}> = () => {
  const {book, chapter, links} = useLoaderData() as {book: BookJSON; chapter: ChapterJSON; links: LinkJSON[]}
  const {success} = (useActionData() ?? {}) as {success?: boolean}
  const [openOverlay, setOpenOVerlay] = useState(false)

  const createdFailed = success === false

  useEffect(() => {
    if (success === true) setOpenOVerlay(false)
  }, [success])

  return (
    <div>
      {createdFailed ? <Notification status="error" title="Error creating the chapter" /> : null}
      <OverlayWide open={openOverlay} onClose={force => setOpenOVerlay(force ?? !openOverlay)}>
        <FormNewLink
          onClickCancel={() => {
            ;(document.getElementById('form-new-link') as HTMLFormElement).reset()
            setOpenOVerlay(false)
          }}
        />
      </OverlayWide>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">{capitalizaFirstLetter(chapter.title)}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Chapter details</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Book</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <Link to={`/book/${book.id as string}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                {book.title}
              </Link>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Created at</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {fromTimeStampToDate(chapter.createdAt)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Summary</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{chapter.summary}</dd>
          </div>
          <div className="px-4 sm:px-0">
            <TableFullWidth
              actionButton
              actionButtonText="New link"
              title="Links"
              subtitle="A list of all links in your chapter"
              headers={['kind', 'caption', 'to']}
              rows={links.map(link => [
                link.kind,
                link.body,
                link.to,
                `/book/${link.bookID as string}/chapter/${link.from as string}/link/${link.id as string}/delete`
              ])}
              onClickActionButton={() => setOpenOVerlay(true)}
              rowAction="delete"
              kindAction="alert"
            />
          </div>
        </dl>
      </div>
    </div>
  )
}
