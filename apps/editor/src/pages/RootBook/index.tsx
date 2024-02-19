import {FC} from 'react'
import {ActionFunctionArgs, NavLink, Outlet, useLoaderData, useNavigate, useParams} from 'react-router-dom'

import {BookJSON} from '../../domain/book/Models/Book'
import {ChapterJSON} from '../../domain/chapter/Models/Chapter'
import {classNames} from '../../js/css'
import {capitalizaFirstLetter} from '../../js/string'

export const loader = async ({params}: ActionFunctionArgs) => {
  const {bookID} = params as {bookID: string}

  const book = await window.domain.FindByIDBookUseCase.execute({id: bookID})

  return {book: book.toJSON()}
}

export const Component: FC<{}> = () => {
  const {book} = useLoaderData() as {book: BookJSON; rootChapter: ChapterJSON}
  const {bookID} = useParams() as {bookID: string}
  const navigate = useNavigate()
  const tabs = [
    {to: `/book/${bookID}`, title: 'Info'},
    {to: `/book/${bookID}/map`, title: 'Map'},
    {
      to: `/book/${bookID}/preview/${String(book?.rootChapterID)}`,
      title: 'Preview',
      disabled: !book?.rootChapterID
    }
  ]

  return (
    <>
      <div className="relative border-b border-gray-200 pb-5 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <h3 className="hidden text-base font-semibold leading-6 text-gray-900">
            {capitalizaFirstLetter(book?.title ?? '')}
          </h3>
          {/* TODO: Buttons Hidden!!! */}
          <div className="hidden mt-3 flex md:absolute md:right-0 md:top-3 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Share
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bgindigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create
            </button>
          </div>
        </div>
        <div className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="current-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="current-tab"
              name="current-tab"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              defaultValue={'Info'}
              onChange={evt => {
                navigate(tabs[evt.currentTarget.options.selectedIndex].to)
              }}
            >
              {tabs.map(tab => (
                <option key={tab.to}>{tab.title}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8">
              {tabs
                .filter(tab => !tab.disabled)
                .map(tab => {
                  return (
                    <NavLink
                      end
                      key={tab.to}
                      to={tab.to}
                      className={({isActive}) => {
                        return classNames(
                          isActive
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                        )
                      }}
                    >
                      {tab.title}
                    </NavLink>
                  )
                })}
            </nav>
          </div>
        </div>
      </div>

      <div className="py-5 sm:py-6">
        <Outlet />
      </div>
    </>
  )
}
