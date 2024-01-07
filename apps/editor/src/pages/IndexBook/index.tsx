import {FC, useEffect, useState} from 'react'
import {ActionFunctionArgs, Link, LoaderFunctionArgs, redirect, useActionData, useLoaderData} from 'react-router-dom'

import debug from 'debug'

import type {BookJSON} from '../../domain/book/Models/Book'
import {ChapterJSON} from '../../domain/chapter/Models/Chapter'
import type {UserJSON} from '../../domain/user/Models/User'
import {fromTimeStampToDate} from '../../js/date'
import {capitalizaFirstLetter} from '../../js/string'
import {FormNewChapter} from '../../ui/FormNewChapter'
import {Notification} from '../../ui/Notification'
import {OverlayWide} from '../../ui/OverlayWide'

const log = debug('cervantes:pages:IndexBook')

export const loader = async ({params}: LoaderFunctionArgs) => {
  const bookID = params.bookID as string
  log('Getting infromation for Book -> %o', bookID)

  const [book, user, chapters] = await Promise.all([
    window.domain.FindByIDBookUseCase.execute({id: bookID}),
    window.domain.CurrentUserUseCase.execute(),
    window.domain.GetAllChapterUseCase.execute({bookID})
  ])

  if (book.isEmpty()) redirect('/book-not-found')

  return {book: book.toJSON(), user: user.toJSON(), chapters: chapters.toJSON().chapters}
}

export const action = async ({request}: ActionFunctionArgs) => {
  const {id, userID, bookID, title, summary} = Object.fromEntries(await request.formData()) as {
    bookID: string
    id: string
    userID: string
    summary: string
    title: string
    intent: string
  }

  const chapter = await window.domain.CreateChapterUseCase.execute({bookID, id, summary, title, userID})

  if (chapter.isEmpty()) return {success: false}

  return {success: true}
}

export const Component: FC<{}> = () => {
  const {book, chapters} = useLoaderData() as {book: BookJSON; user: UserJSON; chapters: ChapterJSON[]}
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
        <FormNewChapter />
      </OverlayWide>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">{capitalizaFirstLetter(book.title)}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Book details</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Title</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{book.title}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Created at</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {fromTimeStampToDate(book.createdAt)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Summary</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{book.summary}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Chapters</dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <div>
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                  onClick={() => setOpenOVerlay(true)}
                >
                  Create a new chapter
                </a>
                <ul role="list" className="divide-y divide-gray-100">
                  {chapters.map(chapter => {
                    return (
                      <li key={chapter.id} className="flex items-center justify-between gap-x-6 py-5">
                        <div className="flex gap-x-4">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                            <span className="text-sm font-medium leading-none text-white">
                              {chapter.title.toUpperCase().slice(0, 2)}
                            </span>
                          </span>
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              <Link
                                to={`/book/${book.id as string}/chapter/${chapter.id as string}`}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                {chapter.title}
                              </Link>
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{chapter.summary}</p>
                          </div>
                        </div>
                        <Link
                          to={`/book/${book.id as string}/chapter/${chapter.id as string}`}
                          className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          View
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
