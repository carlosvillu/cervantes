import {FC, useRef, useState} from 'react'
import {Form, useLoaderData, useNavigate, useSubmit} from 'react-router-dom'

import {ulid} from 'ulid'

import type {BookJSON} from '../../domain/book/Models/Book'
import {ChapterJSON} from '../../domain/chapter/Models/Chapter'
import type {UserJSON} from '../../domain/user/Models/User'
import {SimpleAlert} from '../SimpleAlert'
import {SubmitButton} from '../SubmitButton'

export const FormCreateOrEditChapter: FC<{onClickCancel?: () => void; action: string}> = ({onClickCancel, action}) => {
  const removeForm = useRef<HTMLFormElement>(null)
  const {book, user, chapter} = useLoaderData() as {book: BookJSON; user: UserJSON; chapter?: ChapterJSON}
  const [showAlertRemove, setShowAlertRemove] = useState(false)
  const navigate = useNavigate()
  const submit = useSubmit()

  return (
    <>
      {showAlertRemove && (
        <SimpleAlert
          actionLabel="Remove"
          body="Are you sure you want to remove your chapter? All of your data will be permanently removed from our servers forever. This action cannot be undone."
          title="Remove chapter"
          onCancel={() => {
            setShowAlertRemove(false)
          }}
          onAccept={() => {
            if (removeForm.current) submit(removeForm.current)
          }}
        />
      )}
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold leading-6 text-gray-900">{chapter ? 'Edit Chapter' : 'New Chapter'}</h2>
        <div className="mt-3 flex -ml-4 sm:ml-4 sm:mt-0">
          {chapter && (
            <Form id="form-remove-chapter" method="post" action={action} ref={removeForm}>
              <input type="hidden" name="intent" value="remove-chapter" />
              <input type="hidden" name="bookID" value={book.id} />
              <input type="hidden" name="chapterID" value={chapter.id} />
              <button
                type="button"
                className="ml-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setShowAlertRemove(true)}
              >
                Delete
              </button>
            </Form>
          )}
        </div>
      </div>
      <Form id="form-new-chapter" method="post" action={action}>
        <input id="id" name="id" type="hidden" value={chapter?.id ?? ulid()} />
        <input id="intent" name="intent" type="hidden" value={chapter ? 'edit-chapter' : 'new-chapter'} />
        <input id="userID" name="userID" type="hidden" value={user.id} />
        <input id="bookID" name="bookID" type="hidden" value={book.id} />
        <input id="createdAt" name="createdAt" type="hidden" value={chapter?.createdAt} />
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
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
                    defaultValue={chapter?.title ?? ''}
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
                    defaultValue={chapter?.summary ?? ''}
                    required
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {chapter
                    ? 'Write a few sentences about your chapter.'
                    : 'Write a few sentences about your new chapter.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => onClickCancel?.() ?? navigate(-1)}
          >
            Cancel
          </button>
          <SubmitButton
            label="Save"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />
        </div>
      </Form>
    </>
  )
}
