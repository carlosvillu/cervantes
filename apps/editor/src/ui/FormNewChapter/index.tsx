import {FC} from 'react'
import {Form, useLoaderData} from 'react-router-dom'

import {ulid} from 'ulid'

import type {BookJSON} from '../../domain/book/Models/Book'
import type {UserJSON} from '../../domain/user/Models/User'

export const FormNewChapter: FC<{onClickCancel: () => void}> = ({onClickCancel}) => {
  const {book, user} = useLoaderData() as {book: BookJSON; user: UserJSON}

  return (
    <>
      <Form id="form-new-chapter" method="post" action={`/book/${book.id as string}?index`}>
        <input id="id" name="id" type="hidden" value={ulid()} />
        <input id="intent" name="intent" type="hidden" value="new-chapter" />
        <input id="userID" name="userID" type="hidden" value={user.id} />
        <input id="bookID" name="bookID" type="hidden" value={book.id} />
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">New Chapter</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    autoComplete="off"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={''}
                    required
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                  Summary
                </label>
                <div className="mt-2">
                  <textarea
                    id="summary"
                    name="summary"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={''}
                    required
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about your new chapter.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => onClickCancel()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            name="intent"
            value="createChapter"
          >
            Save
          </button>
        </div>
      </Form>
    </>
  )
}
