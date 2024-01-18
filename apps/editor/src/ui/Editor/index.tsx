import {FC, useRef} from 'react'
import {Form, useLoaderData, useParams} from 'react-router-dom'

import debug from 'debug'
import {ulid} from 'ulid'

import Underline from '@tiptap/extension-underline'
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import {UserJSON} from '../../domain/user/Models/User'
import {Buttons} from './Buttons'

const extensions = [StarterKit, Underline]
const log = debug('cervantes:editor:ui:editor')

export const Editor: FC<{}> = () => {
  const {user, lastCommitBody} = useLoaderData() as {user: UserJSON; lastCommitBody: string}
  const {bookID, chapterID} = useParams() as {bookID: string; chapterID: string}
  const contentRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    autofocus: 'start',
    injectCSS: false,
    extensions,
    content: lastCommitBody,
    onUpdate: async ({editor}) => {
      const id = ulid()
      const body = await window.domain.CommitBodyUseCase.execute({
        bookID,
        chapterID,
        userID: user.id,
        content: JSON.stringify(editor.getHTML()),
        id
      })

      if (body.isEmpty()) log('Error commiting the body %s', id)
      if (contentRef.current) contentRef.current.setAttribute('value', body.content ?? '')
    },
    editorProps: {
      attributes: {
        class:
          'h-full block w-full px-0 text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 border-none focus-visible:outline-none'
      }
    }
  })

  if (!editor) return null

  return (
    <Form className="h-full" action={`/book/${bookID}/chapter/${chapterID}/editor`} method="post">
      <input type="hidden" name="id" value={ulid()} />
      <input type="hidden" name="userID" value={user.id} />
      <input type="hidden" name="bookID" value={bookID} />
      <input type="hidden" name="chapterID" value={chapterID} />
      <input type="hidden" name="content" value={lastCommitBody} ref={contentRef} />
      <div className="w-full h-full flex flex-col mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
            <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
              <Buttons editor={editor} />
            </div>
            <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
              <p className="hidden pl-3 text-gray-500">saving locally...</p>
            </div>
          </div>
          <button
            type="submit"
            className="p-2 text-gray-500 rounded cursor-pointer sm:ms-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
            </svg>
            <span className="sr-only">Save</span>
          </button>
          <button
            type="button"
            className="hidden sm:block p-2 text-gray-500 rounded cursor-pointer  hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 19 19"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
              />
            </svg>
            <span className="sr-only">Full screen</span>
          </button>
        </div>
        <div className="h-full px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </Form>
  )
}
