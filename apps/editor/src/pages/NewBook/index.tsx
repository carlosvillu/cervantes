import {FC} from 'react'
import {ActionFunctionArgs, Form, redirect, useActionData, useLoaderData, useNavigate} from 'react-router-dom'

import {ulid} from 'ulid'

import type {User} from '../../domain/user/Models/User'
import {Notification} from '../../ui/Notification'

export const loader = async () => {
  return window.domain.CurrentUserUseCase.execute()
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
  const user = useLoaderData() as User
  const {success} = (useActionData() ?? {}) as {success?: boolean}
  const navigate = useNavigate()

  const createdFailed = success === false

  return (
    <>
      {createdFailed ? <Notification status="error" title="Error creating the book" /> : null}
      <Form method="post" action="/new-book">
        <input id="id" name="id" type="hidden" value={ulid()} />
        <input id="userID" name="userID" type="hidden" value={user.id} />
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">New Book</h2>
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
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about your new book.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </Form>
    </>
  )
}
